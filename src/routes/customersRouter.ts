import Router from "koa-router";
import { CustomerController } from "../controllers/customersController";

const router = new Router({prefix:"/customer"});

router.post("/register", CustomerController.createCustomer);

router.get('/allCustomer', CustomerController.fetchCustomers);

router.get('/:id',CustomerController.fetchCustomer)

export default router;