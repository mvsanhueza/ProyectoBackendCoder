import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";

const router = Router();

router.get('/checkout', paymentController.getCheckout);
router.get('/success', paymentController.successCheckout);
router.get('/cancel', paymentController.cancelCheckout);

export default router;