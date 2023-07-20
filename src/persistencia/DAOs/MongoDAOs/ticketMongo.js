import BasicMongo from "./basicMongo.js";
import ticketModel from "../../models/Ticket.js";

class ticketMongo extends BasicMongo {
    constructor(model){
        super(model);
    }
}

export default new ticketMongo(ticketModel);