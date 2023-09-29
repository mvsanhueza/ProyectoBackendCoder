import BasicMongo from "./basicMongo.js";
import ticketModel from "../../models/Ticket.js";

class ticketMongo extends BasicMongo {
    constructor(model){
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

export default new ticketMongo(ticketModel);