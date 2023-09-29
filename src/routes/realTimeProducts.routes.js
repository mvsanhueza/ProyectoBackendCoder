import { Router } from "express";
import realTimeProductsController from '../controllers/realTimeProducts.controller.js'
import { autorization } from "../middlewares/autorization.js";

const router = new Router();

router.get('/', autorization(['admin']), realTimeProductsController.getRealTimeProducts)

export default router;