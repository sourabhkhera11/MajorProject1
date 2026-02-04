import Koa from "koa";
const bodyParser =require("koa-bodyparser");
import morgan from "koa-morgan";
import customerRoutes from "./routes/customersRouter";
import productRoutes from "./routes/productsRouter";
const app = new Koa();

app.use(morgan("dev"));
app.use(bodyParser());

app.use(customerRoutes.routes());
app.use(customerRoutes.allowedMethods());

app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

export default app;
