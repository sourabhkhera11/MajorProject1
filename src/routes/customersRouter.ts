import Router from "koa-router";
import { UserController } from "../controllers/customersController";

const router = new Router({prefix:"/users"});

router.post("/register", UserController.createUser);

router.get('/allUsers', UserController.fetchUsers);

export default router;