import Router from "koa-router";
import { ProductController } from "../controllers/productsController";

const router = new Router({prefix:"/product"});

router.post("/register",ProductController.createProduct);

router.get("/allProducts",ProductController.fetchProducts);

router.get("/:id",ProductController.fetchProduct);

export default router;