import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
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

const cartModel = model('carts', cartSchema);

export default cartModel;