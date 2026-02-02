import Koa from "koa";
const bodyParser =require("koa-bodyparser");
import morgan from "koa-morgan";
import userRoutes from "./routes/customersRouter";
const app = new Koa();

app.use(morgan("dev"));
app.use(bodyParser());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

export default app;
