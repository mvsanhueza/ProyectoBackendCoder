import express from 'express';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';


//Configuración de express:
const app = express();
const PORT = 8080;

//Middlewares:
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes:
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});