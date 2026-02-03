import Koa from "koa";
const bodyParser =require("koa-bodyparser");
import morgan from "koa-morgan";
import customerRoutes from "./routes/customersRouter";
import {errorHandler} from "./middlewares/errorHandler"
const app = new Koa();

app.use(morgan("dev"));
app.use(bodyParser());
app.use(errorHandler);

app.use(customerRoutes.routes());
app.use(customerRoutes.allowedMethods());

export default app;
