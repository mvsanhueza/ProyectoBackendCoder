import cartsMongo from "../persistencia/DAOs/MongoDAOs/cartsMongo.js";

class CartsService {
    async getCartById(cid){
        try {
            const cart = await cartsMongo.findOneById(cid);
            return cart;
        }
        catch {
            return null;
        }
    }
    async createCart () {
        try{
            const cart = await cartsMongo.createOne({});
            return cart;
        }
        catch(err){
            return err;
        }
    }
    async deleteCart (cid){
        try{
            const cart = await cartsMongo.deleteOne(cid);
            return cart;
        }
        catch(err){
            return err;
        }
    }
    async updateCart (cid, cart) {
        try{
            const updatedCart = await cartsMongo.updateOne(cid, cart);
            return updatedCart;
        }
        catch(err){
            return err;
        }
    }
    
}

const cartsService = new CartsService();

export default cartsService