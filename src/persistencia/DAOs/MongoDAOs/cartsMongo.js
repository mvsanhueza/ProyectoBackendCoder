import cartModel from '../../models/Cart.js'
import BasicMongo from "./basicMongo.js";

class CartsMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }

    async findByIdAndPopulate(id, populateStr){
        try{
            const response = await this.model.findById(id).populate(populateStr).lean();
            return response;
        }
        catch(error){
            return error;
        }
    }
}

export default new CartsMongo(cartModel);