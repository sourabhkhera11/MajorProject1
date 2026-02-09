import Router from "koa-router";
import { ProductController } from "../controllers/ProductsController";

const router = new Router({ prefix: "/product" });

router.post("/register", ProductController.createProduct);

router.get("/allProducts", ProductController.fetchProducts);

router.get("/variants", ProductController.fetchProductWithVariants);

router.get("/:id/sales", ProductController.totalSales);

router.get("/:id", ProductController.fetchProduct);

router.delete("/:id", ProductController.deleteProduct);

router.patch("/:id", ProductController.updateProduct);

export default router;
