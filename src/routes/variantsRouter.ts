import Router from "koa-router";
import { variantController } from "../controllers/variantController";

const router = new Router({prefix:"/variant"});

router.post("/register",variantController.createvariant);

export default router;