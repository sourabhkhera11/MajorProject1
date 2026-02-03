import Router from "koa-router";
import { productController } from "../controllers/productsController";

const router = new Router({prefix:"/product"});

router.post("/register", productController.createProduct);

router.get('/allProduct', productController.fetchProducts);

router.get('/:id',productController.fetchProduct)

router.delete('/:id',productController.deleteProduct)

router.patch('/:id',productController.updateProduct);

export default router;