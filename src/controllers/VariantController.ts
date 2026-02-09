import { BaseController } from "./BaseController";
import { variantRepository } from "../Repository/VariantsRepo";
import { Context } from "koa";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/Constant";
import { productRepository } from "../Repository/ProductsRepo";
const variantRepo = new variantRepository();
const productRepo = new productRepository();

export class VariantController extends BaseController{

    static async createvariant(ctx:Context){
            return VariantController.execute(ctx,async()=>{
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
                    throw new AppError("Stock is required!",HTTP_STATUS.BAD_REQUEST);
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

        static async fetchVariants(ctx:Context){
                return VariantController.execute(ctx,async()=>{
                    const take = ctx.query.take ? Number(ctx.query.take) : undefined;
                    const skip = ctx.query.skip ? Number(ctx.query.skip) : undefined;
                    const fields = ctx.query.fields ? (ctx.query.fields as string).split(",") : [] as string[];
                    const variants = await variantRepo.fetchVariants(take,skip,fields);
                    if(!variants){
                        throw new AppError("No variant found",HTTP_STATUS.NOT_FOUND);
                    }
                    return {
                        message : "Data fetched successfully!",
                        result : variants
                    } 
                },HTTP_STATUS.OK)
            }
        
            static async fetchVariant(ctx:Context){
                return VariantController.execute(ctx,async()=>{
                    const fields = ctx.query.fields ? (ctx.query.fields as string).split(",") : [] as string[];
                    const variant = await variantRepo.fetchVariant(ctx.params.id,fields);
                    if(!variant){
                        throw new AppError("No variant found",HTTP_STATUS.NOT_FOUND);
                    }
                    return {
                        message : "Data fetched successfully!",
                        result : variant
                    }
                },HTTP_STATUS.OK)
            }
        
            static async deleteVariant(ctx:Context){
                return VariantController.execute(ctx,async()=>{
                    await variantRepo.deleteVariant(ctx.params.id);
                    return{
                        message : "Variant deleted successfully!",
                    }
                },HTTP_STATUS.OK) 
            }
        
            static async updateVariant(ctx:Context){
                return VariantController.execute(ctx,async()=>{
                    const variantData=(ctx.request as any).body;
                    if(!variantData || Object.keys(variantData).length<1){
                        throw new AppError("Invalid input data",HTTP_STATUS.BAD_REQUEST);
                    }
                    const{
                        sku,
                        price,
                        stock,
                        attributes,
                        productId
                    }=variantData;
                    if(productId){
                        const result = await productRepo.fetchProduct(productId);
                        if(!result){
                            throw new AppError("Product not exist!",HTTP_STATUS.NOT_FOUND);
                        }
                    }
                    const safeFields={
                        sku:sku,
                        price:price,
                        stock:stock,
                        attributes:attributes,
                        productId:productId
                    }
                    await variantRepo.updateVariant(ctx.params.id,safeFields)
                    return{
                        message : "Variant updated successfully"
                    }
                },HTTP_STATUS.OK)
            }
        
}