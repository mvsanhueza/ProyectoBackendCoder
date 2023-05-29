import { Router } from "express";
import CartManager from "../cartManager.js";
import cartModel from "../models/Cart.js";
import productModel from "../models/Product.js";

const cartManager = new CartManager('./carts.json');
const cartRouter = Router();

function getCartById(cid){
    try{
        const cart = cartModel.findById(cid);
        return cart;
    }
    catch{
        return null;
    }
}

function getProductById(pid){
    try{
        const product = productModel.findById(pid);
        return product;
    }
    catch{
        return null;
    }
}

cartRouter.post('/', async (req,res)=>{

    // const mensaje = await cartManager.addCart();
    // res.send(mensaje);

    //Se genera un carro nuevo:
    try{
        await cartModel.create({});
        res.send('Carrito creado');
    }
    catch(err){
        res.send('Error al crear el carrito', err);
    }    

})

cartRouter.delete('/:cid/products/:pid', async (req,res)=>{
    const {cid, pid} = req.params;
    //Se busca el carrito:
    const cart = getCartById(cid);

    if(!cart){
        res.send({error: "No se encontro el carrito con el ID ingresado"});
        return;
    }

    if(cart){
        //Se busca si existe el producto por eliminar:
        cart.products = cart.products.filter(p => p.id_product._id != pid);
        //Se actualiza el carrito en la bd:
        await cartModel.findByIdAndUpdate(cid,cart);

        res.send('Producto eliminado del carrito');
    }
    else{
        res.send({error: "No se encontro el carrito con el ID ingresado"});
    }


})

cartRouter.get('/:id', async (req,res)=>{
    const {id} = req.params;
    try{
        const cart = await cartModel.findOne({_id: id});
        console.log(cart);
        if(cart){
            res.send(cart.products);
        }
        else{
            res.send({error: "No se encontro el carrito con el ID ingresado"})
        }
    }
    catch{
        res.send({error: "No se encontro el carrito con el ID ingresado"})
    }
    
})

cartRouter.post('/:cid/products/:pid', async (req,res)=>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    let cantidad = parseInt(quantity) || 1;

    //Se analiza si existe el carrito y producto:
    const cart = getCartById(cid);
    const product = getProductById(pid);

    if(!cart){
        res.send({error: "No se encontro el carrito con el ID ingresado"});
        return;
    }
    if(!product){
        res.send({error: "No se encontro el producto con el ID ingresado"});
        return;
    }


    //Se analiza si existe el producto en el carrito:
    const cartProduct = cart.products.find(p => p.id_product._id == pid);

    if(cartProduct){
        //Se agrega la cantidad especificada:
        cartProduct.quantity += cantidad;
    }
    else{
        //Se agrega el producto al carrito:
        cart.products.push({id_product: product._id, quantity: cantidad});
    }

    //Se actualiza el carrito en la bd:
    await cartModel.findByIdAndUpdate(cid,cart);

    res.send('Producto agregado al carrito');
})

cartRouter.put('/:cid', async (req,res)=>{
    const {cid} = req.params;
    const {products} = req.body;

    //Se busca el carrito:
    const cart = getCartById(cid);

    if(!cart){
        res.send({error: "No se encontro el carrito con el ID ingresado"});
        return;
    }

    //Se buscan los ids de los productos para agregarlos al carrito:
    //Se genera el nuevo array de productos:
    let newProducts = [];
    for(let i = 0; i < products.length; i++){   
        const product = getProductById(products[i].id_product);
        if(product){
            newProducts.push({id_product: product._id, quantity: products[i].quantity});
        }
    }

    //Se actualiza el carrito:
    cart.products = newProducts;

    //Se actualiza el carrito en la bd:
    await cartModel.findByIdAndUpdate(cid,cart);

    res.send('Carrito actualizado');
});

cartRouter.put('/:cid/products/:pid', async (req,res)=>{
    //Se busca la cantidad de ejemplares con parametro quantity:
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    if(!quantity){
        res.send({error: "No se especifico la cantidad de ejemplares a agregar"});
        return;
    }

    //Se busca el carrito y el producto:
    const cart = getCartById(cid);
    const product = getProductById(pid);

    if(!cart){
        res.send({error: "No se encontro el carrito con el ID ingresado"});
        return;
    }
    if(!product){
        res.send({error: "No se encontro el producto con el ID ingresado"});
        return;
    }


    //Se analiza si existe el producto en el carrito:
    const cartProduct = cart.products.findOne(p => p.id_product._id == pid);

    if(cartProduct){
        //Se actualiza a la cantidad especificada:
        cartProduct.quantity = quantity;

        //Se actualiza el carrito en la bd:
        await cartModel.findByIdAndUpdate(cid,cart);

        res.send('Cantidad agregada al carrito');
    }
    else{
        res.send({error: "No se encontro el producto en el carrito"});
    }
})

cartRouter.delete('/:cid', async (req,res)=>{
    const {cid} = req.params;
    //Se busca el carrito:
    const cart = getCartById(cid);

    if(!cart){
        res.send({error: "No se encontro el carrito con el ID ingresado"});
        return;
    }

    //Se eliminan los productos del carrito:
    cart.products = [];

    await cartModel.findByIdAndUpdate(cid,cart);

    res.send('Carrito eliminado');
})

export default cartRouter;