import Koa from "koa";
const bodyParser =require("koa-bodyparser");
import morgan from "koa-morgan";
import customerRoutes from "./routes/customersRouter";
import productsRouter from "./routes/productsRouter";
import {errorHandler} from "./middlewares/errorHandler"
const app = new Koa();

app.use(morgan("dev"));
app.use(bodyParser());
app.use(errorHandler);

app.use(customerRoutes.routes());
app.use(customerRoutes.allowedMethods());

app.use(productsRouter.routes());
app.use(productsRouter.allowedMethods());

export default app;
