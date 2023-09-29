import productsService from "../services/products.service.js";

class realTimeProductsController {
    async getRealTimeProducts(req, res, next) {
        try {
            const products = (await productsService.getAllProducts()).map((pr) => {return {...pr, _id: pr._id.toString()}} );
        //Se genera el io:
        const io = req.io;
        io.on('connection', async (socket) => {
            socket.on('client:addProduct', async (product) => {
                try {
                    const mensaje = await productsService.createProduct(product);
                    //Se actualizan los productos:
                    const products = (await productsService.getAllProducts()).map((pr) => {return {...pr, _id: pr._id.toString()}} );
                    socket.emit('server:actProducts', products);
                }
                catch (error) {
                    console.log(error);
                }
            })

            socket.on('client:deleteProduct', async (id) => {
                try {
                    const mensaje = await productsService.deleteProduct(id);
                    //Se actualizan los productos:
                    const products = (await productsService.getAllProducts()).map((pr) => {return {...pr, _id: pr._id.toString()}} );
                    io.emit('server:actProducts', products);
                }
                catch (error) {
                    console.log(error);
                }
            })
        })
        res.render('realTimeProducts', { products, session: req.user });

    }
    catch(error) {
        req.logger.error('Error en realTimeProducts ' + error.message);
        next();
    }

}
}

export default new realTimeProductsController();