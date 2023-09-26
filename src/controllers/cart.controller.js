import cartsService from "../services/carts.service.js";
import CustomError from "../services/errors/CustomError.js";
import ENUM_Errors from "../services/errors/enums.js";
import { generateCartNotFoundErrorInfo, generateProductNotFoundErrorInfo, generateProductNotFoundInCartErrorInfo, generateQuantityParameterNotFoundError, generateUpdateCartProductsErrorInfo } from "../services/errors/info.js";
import productsService from "../services/products.service.js";
import ticketService from "../services/ticket.service.js";
import { transporter } from "../utils/nodemailer.js";

export const createCart = async (req, res) => {
    try {
        const cart = await cartsService.createCart();
        req.logger.debug('Carrito creado correctamente');
        res.status(200).send(cart);
    }
    catch (err) {
        req.logger.error('Error al crear el carrito: ' + err.message)
        res.status(500).send('Error al crear el carrito', err);
    }
}
export const deleteCartProduct = async (req, res, next) => {
    try{
        const { cid, pid } = req.params;
        //Se busca el carrito:
        const cart = await cartsService.getCartById(cid);
    
        if (!cart) {
            CustomError.createError({
                name: "Cart not found error",
                cause: generateCartNotFoundErrorInfo(cid),
                message: "El carrito no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            }) 
        }
    
        if (cart) {
            //Se busca si existe el producto por eliminar:
            cart.products = cart.products.filter(p => p.id_product._id != pid);
            //Se actualiza el carrito en la bd:
            await cartsService.updateCart(cid, cart);
            req.logger.debug('Producto eliminado del carrito');
            res.status(200).send('Producto eliminado del carrito');
        }
        else {
            CustomError.createError({
                name: "Cart not found error",
                cause: generateCartNotFoundErrorInfo(cid),
                message: "El carrito no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            }) 
        }
    }
    catch(error)
    {
        req.logger.error('Error al agregar producto al carrito: ' + error.message)
        next(error);
    }
}
export const getCartProducts = async (req, res, next) => {
    const { id } = req.params;
    try {
        const productsCart = await cartsService.findByIdAndPopulate(id, 'products.id_product');
        if (productsCart) {
            res.render('cart', { products: productsCart.products });
        }
        else {
            CustomError.createError({
                name: "Cart not found error",
                cause: generateCartNotFoundErrorInfo(cid),
                message: "El carrito no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            })
        }
        // const cart = await cartsService.getCartById(id);
        // if (cart) {
        //     console.log(cart);
        //     const products = cart.populate('products.id_product');
        //     console.log(products);
        //     
        // }
        // else {
        //     res.send({ error: "No se encontro el carrito con el ID ingresado" })
        // }
    }
    catch (error) {
        req.logger.error('Error al obtener los productos del carrito: ' + error.message)
        next(error)
    }
}
export const postCartProduct = async (req, res, next) => {

    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        let cantidad = parseInt(quantity) || 1;

        //Se analiza si existe el carrito y producto:
        const cart = await cartsService.getCartById(cid);
        const product = await productsService.getProductById(pid);
        if (!cart) {
            CustomError.createError({
                name: "Cart not found error",
                cause: generateCartNotFoundErrorInfo(cid),
                message: "El carrito no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            })            
        }
        if (!product) {

            CustomError.createError({
                name: "Product not found error",
                cause: generateProductNotFoundErrorInfo(pid),
                message: "El producto no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            })            
        }

        //Si el usuario es premium, se analiza que no pueda agregar su producto:
        if(req.user.role === 'premium' && product.owner === req.user.email){
            return res.status(403).json({error: 'No tiene permisos para realizar esta acción'});
        }

        //Se analiza si existe el producto en el carrito:
        const cartProduct = cart.products.find(p => p.id_product._id == pid);

        if (cartProduct) {
            //Se agrega la cantidad especificada:
            cartProduct.quantity += cantidad;
        }
        else {
            //Se agrega el producto al carrito:
            cart.products.push({ id_product: product._id, quantity: cantidad });
        }
        //Se actualiza el carrito en la bd:
        await cartsService.updateCart(cid, cart);

        res.status(200).send('Producto agregado al carrito');
        req.logger.debug('Producto agregado al carrito');
    }
    catch (error) {
        req.logger.error('Error al agregar producto al carrito: ' + error.message)
        next(error);
    }
}
export const putCartProducts = async (req, res, next) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        if (!products) {
            CustomError.createError({
                name: "Products to update not found error",
                cause: generateUpdateCartProductsErrorInfo,
                message: "Los productos a actualizan no se han ingresado",
                code: ENUM_Errors.INVALID_TYPES_ERROR
            })            
        }

        //Se busca el carrito:
        const cart = await cartsService.getCartById(cid);

        if (!cart) {
            CustomError.createError({
                name: "Cart not found error",
                cause: generateCartNotFoundErrorInfo(cid),
                message: "El carrito no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            })            
        }
        //Se buscan los ids de los productos para agregarlos al carrito:
        //Se genera el nuevo array de productos:
        let newProducts = [];
        for (let i = 0; i < products.length; i++) {
            const product = await productsService.getProductById(products[i].id_product);
            if (product) {
                newProducts.push({ id_product: product._id, quantity: products[i].quantity });
            }
        }

        //Se actualiza el carrito:
        cart.products = newProducts;

        //Se actualiza el carrito en la bd:
        await cartsService.updateCart(cid, cart);

        req.logger.debug('Carrito actualizado');
        res.status(200).send('Carrito actualizado');
        
    }

    catch (error) {
        req.logger.error('Error al actualizar el carrito: ' + error.message);
        next(error);
    }


}
export const putCartProduct = async (req, res, next) => {
    //Se busca la cantidad de ejemplares con parametro quantity:
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (!quantity) {
            CustomError.createError({
                name: "Quantity parameter not found error",
                cause: generateQuantityParameterNotFoundError,
                message: "Se requiere el parámetro 'quantity'",
                code: ENUM_Errors.INVALID_TYPES_ERROR
            })            
        }

        //Se busca el carrito y el producto:
        const cart = await cartsService.getCartById(cid);
        const product = await productsService.getProductById(pid);

        if (!cart) {
            CustomError.createError({
                name: "Cart not found error",
                cause: generateCartNotFoundErrorInfo(cid),
                message: "El carrito no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            })
            
        }
        if (!product) {
            CustomError.createError({
                name: "Product not found error",
                cause: generateProductNotFoundErrorInfo(pid),
                message: "El producto no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            })
        }
        //Se analiza si existe el producto en el carrito:
        const cartProduct = cart.products.find(p => p.id_product._id == pid);

        if (cartProduct) {
            //Se actualiza a la cantidad especificada:
            cartProduct.quantity = quantity;

            //Se actualiza el carrito en la bd:
            await cartsService.updateCart(cid, cart);

            res.status(200).send('Cantidad actualizada al carrito');
        }
        else {
            CustomError.createError({
                name: "Product not found in cart error",
                cause: generateProductNotFoundInCartErrorInfo(pid),
                message: "El producto no existe en en el carrito",
                code: ENUM_Errors.INVALID_TYPES_ERROR
            })
        }
    }
    catch (error) {
        req.logger.error('Error al actualizar el carrito: ' + error.message);
        next(error)
    }


}
export const clearCartProducts = async (req, res, next) => {
    const { cid } = req.params;
    try {
        //Se busca el carrito:
        const cart = await cartsService.getCartById(cid);

        if (!cart) {
            CustomError.createError({
                name: "Cart not found error",
                cause: generateCartNotFoundErrorInfo(cid),
                message: "El carrito no existe en la base de datos",
                code: ENUM_Errors.DATABASE_ERROR
            })
        }

        //Se eliminan los productos del carrito:
        cart.products = [];
        await cartsService.updateCart(cid, cart);

        req.logger.debug('Productos eliminados del carrito');
        res.status(200).send('Productos eliminados del carrito');

    }
    catch (error) {
        req.logger.error('Error al eliminar los productos del carrito: ' + error.message)
        next(error);
    }
}

export const getPurchase = async (req, res) => {
    const { cid } = req.params;

    //Se buscan los productos que realizan la compra:
    try {
        const productsCart = await cartsService.findByIdAndPopulate(cid, 'products.id_product');
        const productsPurchase = productsCart.products.filter(p => p.id_product.stock >= p.quantity);
        if (productsPurchase.length === 0) {
            req.logger.info('No hay productos suficientes para realizar la compra')
            res.status(400).send({ error: "No hay productos suficientes para realizar la compra" });
            return;
        }

        //En caso que se pueda efectuar la compra se genera el ticket:
        const amount = productsPurchase.reduce((acc, p) => acc + (p.id_product.price * p.quantity), 0);

        const productsTicket = productsPurchase.map(p => ({ id_product: p.id_product._id, quantity: p.quantity }));

        const objTicket = {
            products: productsTicket,
            amount: amount,
            purchaser: req.user.email
        }
        const newTicket = await ticketService.createTicket(objTicket);
        const cart = await cartsService.getCartById(cid);
        //Se descuentan los stocks de los productos comprados y se eliminan los productos del carrito:
        for (let i = 0; i < productsTicket.length; i++) {

            const newProduct = { ...productsPurchase[i].id_product, stock: productsPurchase[i].id_product.stock - productsPurchase[i].quantity };
            const productUpdated = await productsService.updateProduct(newProduct._id, newProduct);
        }
        cart.products = cart.products.filter(p => !productsPurchase.some(pP => pP.id_product._id.toString() == p.id_product.toString()));

        await cartsService.updateCart(cid, cart);

        //Se genera el texto html de email
        let htmlMail = `<h1> Hemos confirmado tu compra </h1>`;
        htmlMail += `<h2> El código de seguimiento es ${newTicket.code}: </h2>`;
        for (let i = 0; i < productsPurchase.length; i++) {
            htmlMail += `<p> <strong> ${productsPurchase[i].id_product.title}</strong> - ${productsPurchase[i].quantity} Unidades </h3>`;
        }

        htmlMail += `<h2> El monto total es de $${amount} </h2>`;
        htmlMail += `<h3> Muchas gracias por tu compra! </h3>`;

        //Se envía el mail con el ticket:
        let email = await transporter.sendMail({
            to: req.user.email,
            subject: `Compra ${newTicket.code}`,
            html: htmlMail
        });

        res.status(200).render('checkout', { code: newTicket.code, products: productsPurchase, amount: newTicket.amount });
    }
    catch (err) {
        req.logger.error('Error al realizar la compra: ' + err.message)
        res.send({ error: err });
        return;
    }
}