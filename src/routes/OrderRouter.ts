import Router from "koa-router";
import { OrderController } from "../controllers/OrderController";

const router = new Router({ prefix: "/order" });

router.post("/register", OrderController.createOrder);

router.get("/allOrders", OrderController.fetchOrders);

router.get("/:id", OrderController.fetchOrder);

router.delete("/:id", OrderController.deleteOrder);

router.patch("/:id", OrderController.updateOrder);

export default router;
