import ticketMongo from '../persistencia/DAOs/MongoDAOs/ticketMongo.js'

const createCodeTicket = async () =>{
    try{
        const tickets = await ticketMongo.findAll();

        //Se buscan los codes de los ticket:
        const codesNumber = tickets.map(ticket => parseInt(ticket.code.split('#')[1]));
        let codeTicket = codesNumber.length > 0 ? ('#'+(Math.max(...codesNumber) + 1)) : '#1';
        return codeTicket;
    }
    catch(error){
        return null;
    }
}

class TicketService {
    async createTicket(obj){
        try{
            //Se genera el code autoincrementable:
            const code = await createCodeTicket();
            if(code === null){
                return null;
            }
            const ticket = {...obj, code: code};

            const newTicket = await ticketMongo.createOne(ticket);
            return newTicket;
        }
        catch(error){
            return error;
        }
    }
}

const ticketService = new TicketService();

export default ticketService;

