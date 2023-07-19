import userModel from "../../models/User.js";
import BasicMongo from "./basicMongo.js";

class UsersMongo extends BasicMongo {
    constructor(model){
        super(model);
    }
}

export default new UsersMongo(userModel);