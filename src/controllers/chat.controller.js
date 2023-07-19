import messageService from '../services/message.service.js';

export const getMessages = async (req, res) => {

    //Se genera el io:
    const io = req.io;
    io.on('connection', async (socket) =>{
        console.log('Cliente conectado al chat');
        socket.on('client:messageSent', async (message) => {
            try{
                console.log(message);
                const newMessage = await messageService.createMessage(message);
                const messages = await messageService.findAllMessages();
                io.emit('server:messageStored', messages);
            }
            catch(error){
                console.log(error);
            }
        })

        socket.on('client:LoadMessages', async () => {
            try{
                const messages = await messageService.findAllMessages();
                console.log(messages);
                io.emit('server:LoadMessages', messages);
            }
            catch(error){
                console.log(error);
            }
        })
    })

    res.render('chat');
}