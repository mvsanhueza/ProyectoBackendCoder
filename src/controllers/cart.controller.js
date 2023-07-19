import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";

export const createCart = async (req, res) => {
    try {
        const cart = await cartsService.createCart();
        res.send(cart);
    }
    catch (err) {
        res.send('Error al crear el carrito', err);
    }
}
export const deleteCartProduct = async (req, res) => {
    const { cid, pid } = req.params;
    //Se busca el carrito:
    const cart = await cartsService.getCartById(cid);

    if (!cart) {
        res.send({ error: "No se encontro el carrito con el ID ingresado" });
        return;
    }

    if (cart) {
        //Se busca si existe el producto por eliminar:
        cart.products = cart.products.filter(p => p.id_product._id != pid);
        //Se actualiza el carrito en la bd:
        await cartsService.updateCart(cid, cart);

        res.send('Producto eliminado del carrito');
    }
    else {
        res.send({ error: "No se encontro el carrito con el ID ingresado" });
    }
}
export const getCartProducts = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await cartsService.getCartById(id);

        if (cart) {
            const products = cart.populate('products.id_product').lean();
            res.render('cart', { products: products.products });
        }
        else {
            res.send({ error: "No se encontro el carrito con el ID ingresado" })
        }
    }
    catch {
        res.send({ error: "No se encontro el carrito con el ID ingresado" })
    }
}
export const postCartProduct = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    let cantidad = parseInt(quantity) || 1;

    //Se analiza si existe el carrito y producto:
    const cart = await cartsService.getCartById(cid);
    const product = await productsService.getProductById(pid);

    if (!cart) {
        res.send({ error: "No se encontro el carrito con el ID ingresado" });
        return;
    }
    if (!product) {
        res.send({ error: "No se encontro el producto con el ID ingresado" });
        return;
    }

    console.log(cart.products);
    //Se analiza si existe el producto en el carrito:
    const cartProduct = cart.products.find(p => p.id_product._id == pid);

    if (cartProduct) {
        //Se agrega la cantidad especificada:
        cartProduct.quantity += cantidad;
    }
    else {
        console.log(product);
        //Se agrega el producto al carrito:
        cart.products.push({ id_product: product._id, quantity: cantidad });
        console.log(cart.products);
    }
    //Se actualiza el carrito en la bd:
    await cartsService.updateCart(cid, cart);

    res.send('Producto agregado al carrito');
}
export const putCartProducts = async (req,res) =>{
    const {cid} = req.params;
    const {products} = req.body;

    if(!products){
        res.send({error: "No se especificaron los productos a agregar"});
        return;
    }

    //Se busca el carrito:
    const cart = await cartsService.getCartById(cid);

    if(!cart){
        res.send({error: "No se encontro el carrito con el ID ingresado"});
        return;
    }
    //Se buscan los ids de los productos para agregarlos al carrito:
    //Se genera el nuevo array de productos:
    let newProducts = [];
    for(let i = 0; i < products.length; i++){   
        const product = await productsService.getProductById(products[i].id_product);
        if(product){
            newProducts.push({id_product: product._id, quantity: products[i].quantity});
        }
    }

    //Se actualiza el carrito:
    cart.products = newProducts;

    //Se actualiza el carrito en la bd:
    await cartsService.updateCart(cid,cart);

    res.send('Carrito actualizado');
}
export const putCartProduct = async (req,res) =>{
    //Se busca la cantidad de ejemplares con parametro quantity:
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
        res.send({ error: "No se especifico la cantidad de ejemplares a agregar" });
        return;
    }

    //Se busca el carrito y el producto:
    const cart = await cartsService.getCartById(cid);
    const product = await productsService.getProductById(pid);

    if (!cart) {
        res.send({ error: "No se encontro el carrito con el ID ingresado" });
        return;
    }
    if (!product) {
        res.send({ error: "No se encontro el producto con el ID ingresado" });
        return;
    }
    //Se analiza si existe el producto en el carrito:
    const cartProduct = cart.products.find(p => p.id_product._id == pid);

    if (cartProduct) {
        //Se actualiza a la cantidad especificada:
        cartProduct.quantity = quantity;

        //Se actualiza el carrito en la bd:
        await cartsService.updateCart(cid, cart);

        res.send('Cantidad actualizada al carrito');
    }
    else {
        res.send({ error: "No se encontro el producto en el carrito" });
    }
}
export const clearCartProducts = async (req,res) =>{
    const { cid } = req.params;
    //Se busca el carrito:
    const cart = await cartsService.getCartById(cid);

    if (!cart) {
        res.send({ error: "No se encontro el carrito con el ID ingresado" });
        return;
    }

    //Se eliminan los productos del carrito:
    cart.products = [];
    await cartsService.updateCart(cid, cart);

    res.send('Productos eliminados del carrito');
}