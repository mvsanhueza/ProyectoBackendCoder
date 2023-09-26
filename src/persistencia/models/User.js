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
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: 'user',
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
    documents: {
        type: [
            {
                _id: false,
                name: String,
                reference: String,
            }
        ],
        default: [],
    },
    last_connection: {
        type: Date,
        default: Date.now(),
    },
    githubId: String,
    googleId: String,
})

const userModel = model('users', usersSchema);

export default userModel;