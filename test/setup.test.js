import mongoose from "mongoose"
import dotenv from 'dotenv';
import userModel from "../src/persistencia/models/User.js";
import productModel from '../src/persistencia/models/Product.js'
import cartModel from "../src/persistencia/models/Cart.js";


dotenv.config();

before(async () => {
    mongoose.connect(process.env.URL_MONGODB_ATLAS_TEST);
})

after(async () => {
    mongoose.connect(process.env.URL_MONGODB_ATLAS_TEST);
})

export const dropUsers = async () =>{
    await userModel.deleteMany();
}
export const dropProducts = async () =>{
    await productModel.deleteMany();
}

export const dropCarts = async () =>{
    await cartModel.deleteMany();
}

