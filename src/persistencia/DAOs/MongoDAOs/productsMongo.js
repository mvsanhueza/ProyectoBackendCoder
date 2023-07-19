import productModel from "../../models/Product.js";
import BasicMongo from "./basicMongo.js";

class productsMongo extends BasicMongo {
    constructor(model){
        super(model)
    } 
    async findPage (query, options) {
        try{
            const products = await this.model.paginate(query, options);
            return products;
        }
        catch (error){
            return error;
        }
    }
}

export default new productsMongo(productModel);