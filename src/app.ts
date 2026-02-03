import Koa from "koa";
const bodyParser =require("koa-bodyparser");
import morgan from "koa-morgan";
import customerRoutes from "./routes/customersRouter";
const app = new Koa();

app.use(morgan("dev"));
app.use(bodyParser());

app.use(customerRoutes.routes());
app.use(customerRoutes.allowedMethods());

export default app;
