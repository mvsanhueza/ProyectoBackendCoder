import { Schema, model } from "mongoose";

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
        default: 0,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    externalLogin: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: {
            _id: false,
            id_cart: {
                type: Schema.Types.ObjectId,
                ref: 'carts',
            },
        },
        default: null,
    },
    githubId: String,
    googleId: String,
})

const userModel = model('users', usersSchema);

export default userModel;