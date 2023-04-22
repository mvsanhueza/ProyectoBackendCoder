import { Router } from "express";
import  ProductManager  from "../productManager.js";

const productManager = new ProductManager('./products.json');

const productRouter = Router();

productRouter.get('/', async (req, res)=>{
    let {limit} = req.query;
    let intLimit = parseInt(limit);
    const products = await productManager.getProducts();

    if(intLimit > -1 && intLimit < products.length){
        res.send(products.slice(0, intLimit));
        return;
    }

    res.send(products);
})

productRouter.get('/:id', async (req,res)=>{
    const {id} = req.params;
    const product = await productManager.getProductById(id);
    if(product){
        res.send(product);
    }
    else{
        res.send({error: "No se encontro el producto con el ID ingresado"})
    }
})

productRouter.post('/',async (req,res)=>{
    const {title, description,code,price,status,stock,category,thumbnails} = req.body;
    const mensaje = await productManager.addProduct({title, description,code,price,status,stock,category,thumbnails});
    res.send(mensaje);
})

productRouter.put('/:id',async (req,res)=>{
    const id = req.params.id;
    const {title, description,code,price,status,stock,category,thumbnails} = req.body;
    const mensaje = await productManager.updateProduct(id, {title, description, code, price, status, stock, category, thumbnails});
    res.send(mensaje);
})

productRouter.delete('/:id',async (req,res)=>{
    const id = req.params.id;
    const mensaje = await productManager.deleteProduct(id);
    res.send(mensaje);
});

export default productRouter;