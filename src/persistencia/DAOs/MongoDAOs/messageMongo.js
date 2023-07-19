import messageModel from "../../models/Message.js";

class messageMongo {
    async findAll(){
        try{
            const response = await messageModel.find().lean();
            return response;
        }
        catch(error){
            return error;
        }
    }
    async createOne(obj){
        try{
            const response = await messageModel.create(obj);
            return response;
        }
        catch(error){
            return error;
        }
    }
}

export default new messageMongo();