import { Repository } from "typeorm";
import {AppDataSource} from "../data-source";
import {Products} from "../entity/productsEntity"
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/constant";

export class productsRepository{
    private productRepo : Repository<Products>; 

    constructor(){
        this.productRepo = AppDataSource.getRepository(Products);
    }

    async insertProducts(productData:Products): Promise<string>{
        try{
            const product= await this.productRepo.save({
                title: productData.title,
                description: productData.description,
                tags: productData.tags
            });
            return product.title;
        }
        catch(er){
            throw new Error("Failed to add a product!");
        }
    }
    
    async fetchAllproducts():Promise<Products[]> {
        try{
            const products=await this.productRepo.find();
            return products;
        }
        catch(er){
            throw new Error("Failed to fetch product data!");
        }
    }

    async fetchProduct(inputId:bigint):Promise<Products | null>{
        try{
            const product =await this.productRepo.findOneBy({
                id:inputId
            });
            return product;
        }
        catch(er){
            throw new Error("Failed to fetch a particular data!");
        }
    }

    async deleteProduct(inputId:bigint):Promise<void>{
        const result =await this.productRepo.delete({id:inputId});
        if(result.affected === 0){
            throw new AppError("product not Found",HTTP_STATUS.NOT_FOUND);
        } 
    }

    async updateProductById(inputId:bigint,updateData:Partial<Products>):Promise<void>{
        const result= await this.productRepo.update({id:inputId},updateData);
        if(result.affected===0){
            throw new AppError("product not found",HTTP_STATUS.NOT_FOUND);
        }
    }

}
