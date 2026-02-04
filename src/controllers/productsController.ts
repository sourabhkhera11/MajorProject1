import { productRepository } from "../Repository/productsRepo";
import { BaseController } from "./baseController";
import { Context } from "koa";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/constant";

const productRepo = new productRepository();

export class ProductController extends BaseController{

    //Write here the static Controller functions 
    static async createProduct(ctx:Context){
        return ProductController.execute(ctx,async()=>{
            const productData = (ctx.request as any).body;

            if(!productData || Object.keys(productData).length < 1){
                throw new AppError("Invalid input data!",HTTP_STATUS.BAD_REQUEST)
            }

            const {
                title,
                description,
                tags
            }=productData;

            if(!title){
                throw new AppError("Title is required!",HTTP_STATUS.BAD_REQUEST);
            }

            if(!description){
                throw new AppError("Description is required!",HTTP_STATUS.BAD_REQUEST);
            }

            if(!tags || tags.length as number < 1){
                throw new AppError("At least one tag is requires!",HTTP_STATUS.BAD_REQUEST);
            }

            const value = await productRepo.insertProduct(productData);
            return {
                message : "Product created successfully",
                result :  value
            };
        }, HTTP_STATUS.CREATED);
    }
}