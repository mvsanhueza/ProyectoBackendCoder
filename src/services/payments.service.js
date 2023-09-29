import Stripe from 'stripe';
import config from '../config/config.js';
import productsService from './products.service.js';

class PaymentService {
    constructor() {
        this.stripe = new Stripe(config.stripe_secret);
    }

    createSession = async (ticket, success_url, cancel_url) =>{
        //Se buscan los productos con el id:
        const items = await Promise.all(await ticket.products.map(async prod => {
            const product = await productsService.getProductById(prod.id_product);
            return {
                price_data: {
                    currency: 'clp',
                    product_data: {
                        name: product.title,
                        images: [product.thumbnails[0]],
                    },
                    unit_amount: product.price
                },
                quantity: prod.quantity,
            }
        }));

        console.log(items);

        //Se convierte la data a formato Stripe
        const session = await this.stripe.checkout.sessions.create({
            line_items: items,
            mode: 'payment',
            success_url: success_url,
            cancel_url: cancel_url,
        })

        return session;
    }

}

export default new PaymentService();