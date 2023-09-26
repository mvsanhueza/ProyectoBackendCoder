import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = join(dirname(__filename), '/..');

export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
}

export const compareData = async (data, hashData) => {
    return bcrypt.compare(data, hashData);
}

export const JSONParse = (data) => {
    try{
        const obj = JSON.parse(data);
        return obj;
    }
    catch{
        return {};
    }
}

//Multer: 
const storage = multer.diskStorage({
    //Destinacion:
    destination: (req,file,cb) =>{
        const body = req.body;
        const docName = Object.values(body)[0];
        const folder = docName === 'profileImg' ? 'profile' : docName === 'product' ? 'products' : 'documents';

        cb(null, __dirname + '/public/documents/' + folder);
    },
    filename: (req, file, cb) =>{
        const userId = req.params.uid;
        cb(null, userId + '_' + file.originalname);
    }
})

export const uploader = multer({storage});