import { Context } from "node:vm";
import { productsRepository } from "../Repository/productsRepo";
import { HTTP_STATUS } from "../utils/constant";
import { AppError } from "../utils/AppError";

const custRepo = new productsRepository();

export class productController{

    static async createProduct(ctx: Context){
        const productData=ctx.request.body;
        const {title,
            description,
            tags 
        }=productData;
        if(!title){
            throw new AppError("Title is required!",HTTP_STATUS.BAD_REQUEST);
        }
        if(!description){
            throw new AppError("Description is required!",HTTP_STATUS.BAD_REQUEST);
        }
        if(tags.length===0){
            throw new AppError("Atleast one tag is required",HTTP_STATUS.BAD_REQUEST);
        }
        const value=await custRepo.insertProducts(productData);
        ctx.status=HTTP_STATUS.CREATED;
        ctx.body={
            success:true,
            message: `Product ${value} created!`
        }
    }
    static async fetchProducts(ctx: Context){
        const products=await custRepo.fetchAllproducts();
        ctx.status=HTTP_STATUS.OK;
        ctx.body={
            success:true,
            message: "Data fetched successfully",
            data: products
        }
    }
    static async fetchProduct(ctx:Context){
        const product=await custRepo.fetchProduct(ctx.params.id);
        ctx.status=HTTP_STATUS.OK;
        ctx.body={
            success:true,
            message:"Date fetched successfully",
            data:product
        }
    }

    static async deleteProduct(ctx:Context){
        await custRepo.deleteProduct(ctx.params.id);
        ctx.status=HTTP_STATUS.OK;
        ctx.body={
            success:true,
            message: "product deleted successfully"
        }
    }

    static async updateProduct(ctx:Context){
        await custRepo.updateProductById(ctx.params.id,ctx.request.body);
        ctx.status=HTTP_STATUS.OK;
        ctx.body={
            success:true,
            message:"product updated successfully"
        }
    }

}
