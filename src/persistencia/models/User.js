import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
        default: 0,
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    externalLogin: {
        type: Boolean,
        default: false,
    },
    githubId: String,
    googleId: String,
    //facebookId: String,
})

const userModel = mongoose.model('users', usersSchema);

export default userModel;