import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    purchase_datetime: {
        type: Date,
        default: Date.now(),
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
    products: {
        type: [
            {
                _id: false,
                id_product: {
                    type: Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: Number
            }
        ],
        default: []
    }    
})

const ticketModel = model('tickets', ticketSchema);
export default ticketModel;