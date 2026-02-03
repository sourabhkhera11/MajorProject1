import { Context } from "node:vm";
import { AppError } from "../utils/AppError";

export class BaseController {

  protected static async execute(
    ctx: Context,
    fn: () => Promise<any>,
    successStatus = 200
  ) {
    try {
      const data = await fn();

      ctx.status = successStatus;
      ctx.body = {
        success: true,
        data
      };

    } catch (error: any) {

      if (error instanceof AppError) {
        ctx.status = error.statusCode;
        ctx.body = {
          success: false,
          message: error.message
        };
        return;
      }

      console.error(error);

      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "Internal Server Error"
      };
    }
  }
}
