import productsMongo from "../persistencia/DAOs/MongoDAOs/productsMongo.js";
import { JSONParse } from "../utils/utils.js";

class ProductsService {
    async getPageProducts(query, limit, page, sort){
        try{
            let intLimit = limit ? parseInt(limit) : 10;
            let intPage = page ? parseInt(page) : 1;
            let sortObj = sort && (sort === 'asc' || sort === 'desc') ? {price: sort} : {};
            //Para el query se verifica si existe el parametro en el model:
            let queryObj = query ? JSONParse(query) : {};
            const products = await productsMongo.findPage(queryObj, { limit: intLimit, page: intPage, sort: sortObj, lean: true });
            return products;
        }
        catch (error){
            return error;
        }
    }
    async getProductById(id){
        try{
            const product = await productsMongo.findOneById(id);
            return product;
        }
        catch (error){
            return error;
        }
    }

    async createProduct(product){
        try{
            if(!product.thumbnails){
                product.thumbnails = [];
            }
            const newProduct = await productsMongo.createOne(product);
            return newProduct;
        }
        catch(error) {
            return error
        }
    }
    async updateProduct(id, product){
        try{
            const newProduct = await productsMongo.updateOne(id, product);
            return newProduct;
        }
        catch(error){
            return error;
        }
    }
    async deleteProduct(id){
        try{
            const deletedProduct = await productsMongo.deleteOne(id);
            return deletedProduct;
        }
        catch(error){
            return
        }
    }
    
}

const productsService = new ProductsService();
export default productsService;
;