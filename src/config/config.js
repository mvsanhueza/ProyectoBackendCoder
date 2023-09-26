import dotenv from 'dotenv';
import program from '../utils/commander.js';

dotenv.config();

export default {
    port : process.env.PORT,
    mongo_uri: program.opts().mode === 'test' ?  process.env.URL_MONGODB_ATLAS_TEST : process.env.URL_MONGODB_ATLAS,
    session_secret: process.env.SESSION_SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    facebook_client_id: process.env.FACEBOOK_CLIENT_ID,
    facebook_client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,
}