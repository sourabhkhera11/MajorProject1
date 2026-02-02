import { Context, Next } from "koa";
import { AppError } from "../utils/AppError";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error: any) {
    if (error instanceof AppError) {
      ctx.status = error.statusCode;
      ctx.body = {
        success: false,
        message: error.message,
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "Internal Server Error",
      };
      console.error(error);
    }
  }
}
