import { BaseController } from "./baseController";
import { variantRepository } from "../Repository/variantsRepo";
import { Context } from "koa";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/constant";
import { productRepository } from "../Repository/productsRepo";
const variantRepo = new variantRepository();
const productRepo = new productRepository();

export class variantController extends BaseController{

    static async createvariant(ctx:Context){
            return variantController.execute(ctx,async()=>{
                const variantData = (ctx.request as any).body;
                console.log(variantData);
                
                if(!variantData || Object.keys(variantData).length < 1){
                    throw new AppError("Invalid input data!",HTTP_STATUS.BAD_REQUEST)
                }
    
                const {
                    sku,
                    price,
                    stock,
                    attributes,
                    productId
                }=variantData;
    
                if(!sku){
                    throw new AppError("SKU is required!",HTTP_STATUS.BAD_REQUEST);
                }
    
                if(!price){
                    throw new AppError("Price is required!",HTTP_STATUS.BAD_REQUEST);
                }

                if(!stock){
                    throw new AppError("Price is required!",HTTP_STATUS.BAD_REQUEST);
                }

                if(!productId){
                    throw new AppError("ProductId is required!",HTTP_STATUS.BAD_REQUEST);
                }

                const productExist = await productRepo.fetchProduct(productId);
                if(!productExist){
                    throw new AppError("Product not exist!",HTTP_STATUS.BAD_REQUEST);
                }
                
                if(!attributes || Object.keys(attributes).length as number < 1){
                    throw new AppError("Attributes are missing or empty",HTTP_STATUS.BAD_REQUEST);
                }
    
                const value = await variantRepo.createVariants(variantData);
                return {
                    message : "Variant created successfully",
                    result :  value
                };
            }, HTTP_STATUS.CREATED);
        }
}