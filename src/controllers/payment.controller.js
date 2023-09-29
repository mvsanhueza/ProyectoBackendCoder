import cartsService from "../services/carts.service.js";
import paymentsService from "../services/payments.service.js";
import productsService from "../services/products.service.js";
import ticketService from "../services/ticket.service.js";
import { transporter } from "../utils/nodemailer.js";
import { generateUrl } from "../utils/utils.js";


class paymentController {
    async getCheckout(req, res, next) {
        try {
            const ticket = req.session.ticket
            //Se generan los urls de sacces o cancel:
            const protocol = req.protocol;
            const host = req.headers.host;

            const success_url = generateUrl(protocol, host, 'api/payment/success');
            const cancel_url = generateUrl(protocol, host, 'api/payment/cancel');

            const checkout = await paymentsService.createSession(ticket, success_url, cancel_url);

            res.redirect(303, checkout.url);
        }
        catch (error) {
            req.logger.error('Error al generar el checkout: ' + error.message);
            next();
        }

    }

    async successCheckout(req, res, next) {
        try {

            const objTicket = req.session.ticket;
            const cid = req.user.cart.id_cart;

            //Se genera el ticket y se envía el mail del pedido:
            const newTicketCreate = await ticketService.createTicket(objTicket);
            const newTicket = await ticketService.findByIdAndPopulate(newTicketCreate._id, 'products.id_product');
            console.log(newTicket);
            const cart = await cartsService.getCartById(cid);
            //Se eliminan los productos del carrito
            cart.products = cart.products.filter(p => !objTicket.products.some(ticketProduct => ticketProduct.id_product == p.id_product.toString()));

            await cartsService.updateCart(cid, cart);

            //Se genera el texto html de email
            let htmlMail = `<h1> Hemos confirmado tu compra </h1>`;
            htmlMail += `<h2> El código de seguimiento es ${newTicket.code}: </h2>`;
            for (let i = 0; i < newTicket.products.length; i++) {
                htmlMail += `<p> <strong> ${newTicket.products[i].id_product.title}</strong> - ${newTicket.products[i].quantity} Unidades </h3>`;
            }

            htmlMail += `<h2> El monto total es de $${objTicket.amount} </h2>`;
            htmlMail += `<h3> Muchas gracias por tu compra! </h3>`;

            //Se envía el mail con el ticket:
            let email = await transporter.sendMail({
                to: req.user.email,
                subject: `Compra ${newTicket.code}`,
                html: htmlMail
            });

            res.status(200).render('checkout', { code: newTicket.code, products: newTicket.products, amount: newTicket.amount });

        }
        catch (error) {
            req.logger.error('Error al terminar el pedido: ' + error.message);
            next();
        }
    }

    async cancelCheckout(req,res,next){
        try{
            //Se retorna el stock de productos y se elimina ticket:
            const ticket = req.session.ticket;
            for(let i = 0; i < ticket.products.length; i++){
                const ticketProduct = ticket.products[i];
                const product = await productsService.getProductById(ticketProduct.id_product);
                product.stock += ticketProduct.quantity;
                await productsService.updateProduct(product._id, product);
            }
            
            //Se vuelve al carrito de compras del usuario
            const cid = req.user.cart.id_cart;

            res.redirect(`/api/carts/${cid}`)
        }
        catch(error){
            req.logger.error('Error al retornar stock: ' + error.message);
            next();
        }
    }
}

export default new paymentController();