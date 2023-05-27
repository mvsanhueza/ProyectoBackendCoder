import { Router } from "express";
import CartManager from "../cartManager.js";

const cartManager = new CartManager('./carts.json');
const cartRouter = Router();

cartRouter.post('/', async (req,res)=>{
    const mensaje = await cartManager.addCart();
    res.send(mensaje);
})

cartRouter.get('/:id', async (req,res)=>{
    const {id} = req.params;
    const cart = await cartManager.getCartById(id);
    if(cart){
        res.send(cart.products);
    }
    else{
        res.send({error: "No se encontro el carrito con el ID ingresado"})
    }
})

cartRouter.post('/:cid/product/:pid', async (req,res)=>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    const mensaje = await cartManager.addProductToCart(cid, pid, quantity);
    res.send(mensaje);
})


export default cartRouter;