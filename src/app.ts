import Koa from "koa";
const bodyParser =require("koa-bodyparser");
import morgan from "koa-morgan";
import customerRoutes from "./routes/customersRouter";
import productRoutes from "./routes/productsRouter";
import variantRoutes from "./routes/variantsRouter";
const app = new Koa();

app.use(morgan("dev"));
app.use(bodyParser());

app.use(customerRoutes.routes());
app.use(customerRoutes.allowedMethods());

app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

app.use(variantRoutes.routes());
app.use(variantRoutes.allowedMethods());

export default app;
