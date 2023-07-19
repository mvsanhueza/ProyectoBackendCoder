import { Router } from "express";
import { getMessages } from "../controllers/chat.controller.js";
import { autorization } from "../middlewares/autorization.js";

const chatRouter = Router();

chatRouter.get('/', autorization(false), getMessages);

export default chatRouter;