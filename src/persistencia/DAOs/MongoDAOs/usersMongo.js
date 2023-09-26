import userModel from "../../models/User.js";
import BasicMongo from "./basicMongo.js";

class UsersMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }

    async uploadDocument(id, docName, filePath) {
        try {
            const user = await userModel.findById(id);

            if (!user) {
                return { error: "User not found" };
            }

            //Se analiza si existe el documento o no
            const doc = user.documents.find((doc) => doc.name === docName)

            //En caso que no exista se pushea:
            if (!doc) {
                const update = { $push: { documents: { name: docName, reference: filePath } } };
                const newUser = await userModel.findByIdAndUpdate(id, update);
            }
            else {
                const update = { $set: { documents: { name: docName, reference: filePath } } };
                const newUser = await userModel.findByIdAndUpdate(id, update);

            }
        }
        catch (error) {
            return { error: error };
        }
    }
}

export default new UsersMongo(userModel);