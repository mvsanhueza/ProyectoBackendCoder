export default class BasicMongo { 
    constructor(model){
        this.model = model;
    }

    async findAll() {
        try{
            const response = await this.model.find().lean();
            return response;
        }
        catch(error){
            return error;
        }
    }
    async findOneById(id){
        try{
            const response = await this.model.findById(id).lean();
            return response;
        }
        catch(error){
            return error;
        }
    }
    async findOne(obj){
        try{
            const response = await this.model.findOne(obj).lean();
            return response;
        }
        catch(error){
            return error;
        }
    }
    async createOne(obj){
        try{
            const response = await this.model.create(obj);
            return response;
        }
        catch(error){
            return error;
        }
    }
    async deleteOne(id){
        try{
            const response = await this.model.findByIdAndDelete(id);
            return response;
        }
        catch(error){
            return error;
        }
    }
    async updateOne(id, obj){
        try{
            const response = await this.model.findByIdAndUpdate(id, obj);
            return response;
        }
        catch(error){
            return error;
        }
    }
}