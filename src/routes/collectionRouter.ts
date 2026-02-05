import Router from "koa-router";
import { CollectionController } from "../controllers/collectionController";

const router = new Router({prefix:"/collection"});

router.post("/register", CollectionController.createCollection);

router.get('/allCollection', CollectionController.fetchCollections);

router.get('/:id',CollectionController.fetchCollection)

router.delete('/:id',CollectionController.deleteCollection)

router.patch('/:id',CollectionController.updateCollection);

export default router;