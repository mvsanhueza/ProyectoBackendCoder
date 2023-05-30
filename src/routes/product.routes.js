import { Router } from "express";
import productModel from "../models/Product.js";
import  ProductManager  from "../productManager.js";

const productManager = new ProductManager('./products.json');

const productRouter = Router();

function JSONParse(str){
    try{
        const obj = JSON.parse(str);
        return obj;
    }
    catch{
        return {};
    }
}

productRouter.get('/', async (req, res)=>{

    const result = {
        status: "error",
        payload: [],
        totalPages: 0,
        prevPage: 0,
        nextPage: 0,
        page: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevLink: null,
        nextLink: null,
    }
    
    try{
        let {limit, page, sort, query} = req.query;
        //Se asignan los valores para la lectura:
        let intLimit = limit ? parseInt(limit) : 10;
        let intPage = page ? parseInt(page) : 1;
        let sortObj = sort && (sort === 'asc' || sort === 'desc') ? {price: sort} : {};
        //Para el query se ferifica si existe el parametro en el model:
        let queryObj = query ? JSONParse(query) : {};
        const products = await productModel.paginate(queryObj, { limit: intLimit, page: intPage, sort: sortObj, lean: true });  

        result.status = "success";
        result.payload = products.docs;
        result.totalPages = products.totalPages;
        result.prevPage = products.prevPage;
        result.nextPage = products.nextPage;
        result.hasPrevPage = products.hasPrevPage;
        result.hasNextPage = products.hasNextPage;
        result.page = intPage;

        //Se busca el prevlink y el nextling según corresponda:
        let linkAddOptions = (limit ? (`&limit=${limit}`) : "") + (sort ? (`&sort=${sort}`) : "") + (query ? (`&query=${query}`) : "");
        result.prevLink = products.hasPrevPage ? (`http://localhost:8080/api/products?page=${products.prevPage}` + linkAddOptions) : null;
        result.nextLink = products.hasNextPage ? (`http://localhost:8080/api/products?page=${products.nextPage}` + linkAddOptions) : null;
    }
    catch{
    }

    res.render('home', result);
})

productRouter.get('/realtimeproducts', async (req, res)=>{
    const products = await productManager.getProducts();
    // req.io.on('connection', (socket)=>{
    //     console.log('Conectado desde router');
    //     socket.on('addProduct', async (product)=>{
    //         const mensaje = await productManager.addProduct(product);
    //         console.log(mensaje);
    //         const products = await productManager.getProducts();            
    //         socket.emit('actProducts', products);
    //     })
    //     socket.on('deleteProduct', async (id)=>{
    //         const mensaje = await productManager.deleteProduct(id);
    //         console.log(mensaje);
    //         const products = await productManager.getProducts();            
    //         socket.emit('actProducts', products);
    //     })
    // })
    res.render('realTimeProducts', {products});
})

productRouter.get('/:id', async (req,res)=>{
    const {id} = req.params;
    console.log(id);
    const product = await productManager.getProductById(id);
    if(product){
        res.render('home',{products:[product]});
    }
    else{
        res.send({error: "No se encontro el producto con el ID ingresado"})
    }
})


productRouter.post('/',async (req,res)=>{
    const {title, description,code,price,stock,category,thumbnails} = req.body;

    const thumbnailsVal = thumbnails ?? [];

    await productModel.create({title:title, description: description, code: code, price: price, stock: stock, category: category, thumbnails: thumbnailsVal});

    // const mensaje = await productManager.addProduct({title, description,code,price,status,stock,category,thumbnails});
    res.send("Objeto agregado");
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