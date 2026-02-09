import { productRepository } from "../Repository/ProductsRepo";
import { BaseController } from "./BaseController";
import { Context } from "koa";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/Constant";
import { Product } from "../entity/ProductEntity";

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

    static async fetchProducts(ctx:Context){
        return ProductController.execute(ctx,async()=>{
            const take = ctx.query.take ? Number(ctx.query.take) : undefined;
            const skip = ctx.query.skip ? Number(ctx.query.skip) : undefined;
            const tags = (ctx.query.tags) ? (ctx.query.tags as string).split(',') : [] as string[]; 
            const fields = ctx.query.fields ? (ctx.query.fields as string).split(",") : [] as string[];
            const products = await productRepo.fetchProducts(take,skip,fields,tags);
            if(!products){
                throw new AppError("No product found",HTTP_STATUS.NOT_FOUND);
            }
            return {
                message : "Data fetched successfully!",
                result : products
            } 
        },HTTP_STATUS.OK)
    }

    static async fetchProduct(ctx:Context){
        return ProductController.execute(ctx,async()=>{
            const fields = ctx.query.fields ? (ctx.query.fields as string).split(",") : [] as string[];
            const product = await productRepo.fetchProduct(ctx.params.id,fields);
            if(!product){
                throw new AppError("No product found",HTTP_STATUS.NOT_FOUND);
            }
            return {
                message : "Data fetched successfully!",
                result : product
            }
        },HTTP_STATUS.OK)
    }

    static async deleteProduct(ctx:Context){
        return ProductController.execute(ctx,async()=>{
            await productRepo.deleteProduct(ctx.params.id);
            return{
                message : "Product deleted successfully!",
            }
        },HTTP_STATUS.OK) 
    }

    static async updateProduct(ctx:Context){
        return ProductController.execute(ctx,async()=>{
            const productData=(ctx.request as any).body;
            if(!productData || Object.keys(productData).length<1){
                throw new AppError("Invalid input data",HTTP_STATUS.BAD_REQUEST);
            }
            const{
                title,
                description,
                tags
            }=productData;
            const safeFields={
                title:title,
                description:description,
                tags:tags
            }
            await productRepo.updateProduct(ctx.params.id,safeFields)
            return{
                message : "Product updated successfully"
            }
        },HTTP_STATUS.OK)
    }

    static async fetchProductWithVariants(ctx:Context){
        return ProductController.execute(ctx,async()=>{
            const data = await productRepo.productWithVariants();
            if(!data){
                throw new AppError("No product found!",HTTP_STATUS.NOT_FOUND);
            }
            return { 
                message : "Data Fetced Successfully!",
                results : data
            }
        },HTTP_STATUS.OK)
    }

    static async totalSales(ctx:Context){
        return ProductController.execute(ctx,async()=>{
            const data =  await productRepo.totalSalesOfProduct(ctx.params.id);
            if(!data){
                throw new AppError("No product found!",HTTP_STATUS.NOT_FOUND);
            }
            const numberOfProducts = data.orders.reduce((num, product) => num + Number(product.numberOfUnitsOrdered),0);
            const totalSales = data.orders.reduce((amount, product) => amount+ Number(product.totalAmount),0);
            return{
                message : "Details are calculated successfully!",
                totalNumberOfItemBeingSold : numberOfProducts,
                totalSales : totalSales
            }
        })
    }
}