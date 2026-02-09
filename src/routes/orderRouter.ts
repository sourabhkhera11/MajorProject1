import Router from "koa-router";
import { OrderController } from "../controllers/orderController";

const router = new Router({prefix:"/order"});

router.post("/register",OrderController.createOrder);

// router.get("/allProducts",ProductController.fetchProducts);

// router.get("/variants",ProductController.fetchProductWithVariants)

// router.get("/:id",ProductController.fetchProduct);

// router.delete("/:id",ProductController.deleteProduct);

// router.patch("/:id",ProductController.updateProduct)


export default router;