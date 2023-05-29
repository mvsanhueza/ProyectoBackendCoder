import 'dotenv/config';
import express from 'express';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import { engine } from 'express-handlebars';
import {Server} from 'socket.io';
import * as path from 'path';
import { __dirname } from './path.js';
import ProductManager from './productManager.js';
import mongoose from 'mongoose';


//Configuración de express:
const app = express();
const PORT = 8080;
//Configuración handlebars:
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const productManager = new ProductManager('./products.json');

//IO SERVER:
const io = new Server(server);
io.on('connection',(socket)=>{
    console.log('Conectado al socket');
    socket.on('addProduct', async (product)=>{
        const mensaje = await productManager.addProduct(product);
        console.log(mensaje);
        const products = await productManager.getProducts();            
        socket.emit('actProducts', products);
    })
    socket.on('deleteProduct', async (id)=>{
        const mensaje = await productManager.deleteProduct(id);
        console.log(mensaje);
        const products = await productManager.getProducts();            
        socket.emit('actProducts', products);
    })
})
//Middlewares:
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req,res,next)=>{ //Realizamos el io accesible a los routes:
    req.io = io;
    next();
})

//Mongo DB:
mongoose.connect(process.env.URL_MONGODB_ATLAS).then(()=>console.log("DB is Connected")).catch((err)=>console.log("Error en MongoDB: ", err));


//Routes:
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', express.static(path.resolve(__dirname, './public')));
app.use('/api/', productRouter);


