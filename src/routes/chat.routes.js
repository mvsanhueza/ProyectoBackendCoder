import { Router } from "express";
import { getMessages } from "../controllers/chat.controller.js";
import { autorization } from "../middlewares/autorization.js";

const chatRouter = Router();

chatRouter.get('/', autorization(['user', 'premium']), getMessages);

export default chatRouter;