import Router from "koa-router";
import { ProductController } from "../controllers/productsController";

const router = new Router({prefix:"/product"});

router.post("/register",ProductController.createProduct);

export default router;