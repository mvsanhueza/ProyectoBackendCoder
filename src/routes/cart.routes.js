import { Router } from "express";
import { clearCartProducts, createCart, deleteCartProduct, getCartProducts, postCartProduct, putCartProduct, putCartProducts } from "../controllers/cart.controller.js";
import { autorization } from "../middlewares/autorization.js";

const cartRouter = Router();

cartRouter.post('/', createCart);
cartRouter.delete('/:cid/products/:pid', deleteCartProduct);
cartRouter.get('/:id', getCartProducts);
cartRouter.post('/:cid/products/:pid', autorization(false), postCartProduct);
cartRouter.put('/:cid', putCartProducts);
cartRouter.put('/:cid/products/:pid', putCartProduct)
cartRouter.delete('/:cid', clearCartProducts)

export default cartRouter;