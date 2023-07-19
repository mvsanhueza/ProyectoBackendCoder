import { Router } from "express";
import { getProductById, getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { autorization } from "../middlewares/autorization.js";


//const productManager = new ProductManager('./products.json');

const productRouter = Router();

productRouter.get('/', getProducts);
// productRouter.get('/realtimeproducts', async (req, res)=>{
//     const products = await productManager.getProducts();
//     // req.io.on('connection', (socket)=>{
//     //     console.log('Conectado desde router');
//     //     socket.on('addProduct', async (product)=>{
//     //         const mensaje = await productManager.addProduct(product);
//     //         console.log(mensaje);
//     //         const products = await productManager.getProducts();            
//     //         socket.emit('actProducts', products);
//     //     })
//     //     socket.on('deleteProduct', async (id)=>{
//     //         const mensaje = await productManager.deleteProduct(id);
//     //         console.log(mensaje);
//     //         const products = await productManager.getProducts();            
//     //         socket.emit('actProducts', products);
//     //     })
//     // })
//     res.render('realTimeProducts', {products});
// })
productRouter.get('/:id', getProductById);
productRouter.post('/', autorization(true), createProduct);
productRouter.put('/:id', autorization(true), updateProduct)
productRouter.delete('/:id', autorization(true), deleteProduct);

export default productRouter;