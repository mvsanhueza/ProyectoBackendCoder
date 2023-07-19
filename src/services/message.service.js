import messageMongo from "../persistencia/DAOs/MongoDAOs/messageMongo.js";

class MessageService {
    async findAllMessages(){
        try{
            const messages = await messageMongo.findAll();
            return messages;
        }
        catch(error){
            return error;
        }
    }
    async createMessage(obj){
        try{
            const newMessage = await messageMongo.createOne(obj);
            return newMessage;
        }
        catch(error){
            return error;
        }
    }
}

const messageService = new MessageService();
export default messageService;