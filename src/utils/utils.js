import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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