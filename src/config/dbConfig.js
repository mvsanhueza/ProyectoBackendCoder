import mongoose, { mongo } from "mongoose";
import config from "./config.js";

const URI = config.mongo_uri;

mongoose.connect(URI)
        .then(() => console.log('Conectado a la base de datos'))
        .catch((error) => console.log(error));