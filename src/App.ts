import Koa from "koa";
const bodyParser =require("koa-bodyparser");
import morgan from "koa-morgan";
import customerRoutes from "./routes/CustomersRouter";
import productRoutes from "./routes/ProductsRouter";
import variantRoutes from "./routes/VariantsRouter";
import collectionRoutes from "./routes/CollectionRouter";
import orderRoutes from "./routes/OrderRouter"
const app = new Koa();

app.use(morgan("dev"));
app.use(bodyParser());

app.use(customerRoutes.routes());
app.use(customerRoutes.allowedMethods());

app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

app.use(variantRoutes.routes());
app.use(variantRoutes.allowedMethods());

app.use(collectionRoutes.routes());
app.use(collectionRoutes.allowedMethods());

app.use(orderRoutes.routes());
app.use(orderRoutes.allowedMethods());

export default app;
