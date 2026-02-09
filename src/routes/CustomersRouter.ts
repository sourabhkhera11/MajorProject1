import Router from "koa-router";
import { CustomerController } from "../controllers/CustomersController";

const router = new Router({prefix:"/customer"});

router.post("/register", CustomerController.createCustomer);

router.get('/allCustomer', CustomerController.fetchCustomers);

router.get("/:id/spend", CustomerController.totalSpendByCustomer);

router.get("/:id/orders", CustomerController.allOrdersWithProductName);

router.get('/:id',CustomerController.fetchCustomer)

router.delete('/:id',CustomerController.deleteCustomer)

router.patch('/:id',CustomerController.updateCustomer);

export default router;