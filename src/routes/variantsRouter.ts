import Router from "koa-router";
import { VariantController } from "../controllers/VariantController";

const router = new Router({prefix:"/variant"});

router.post("/register",VariantController.createvariant);

router.get("/allVariants",VariantController.fetchVariants);

router.get("/:id",VariantController.fetchVariant);

router.delete("/:id",VariantController.deleteVariant);

router.patch("/:id",VariantController.updateVariant)

export default router;