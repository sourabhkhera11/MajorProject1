import { Repository, ReturningStatementNotSupportedError } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/productEntity";
import { getSafeSelectFields } from "../utils/selectFields";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/constant";

export class productRepository{
    //first thing is properties define 
    private productRepo : Repository<Product>

    //constructor for initailising the repo
    constructor(){
        this.productRepo = AppDataSource.getRepository(Product);
    }

    //Now all the database related methods you want to perform 
    async insertProduct(productData: Product): Promise<Product>{
        const product = await this.productRepo.save({
            title: productData.title,
            description: productData.description,
            tags: productData.tags
        })
        return product;
    }

    async fetchProducts(take : number =10,skip : number =0, fields?: string[]) : Promise<Product[]>{
        const safeFields = getSafeSelectFields(AppDataSource, Product, fields);
        const products = await this.productRepo.find({
            take,
            skip,
            select:safeFields
        });
        return products;
    }

    async fetchProduct(id : bigint , fields? : string[]) : Promise<Product | null>{
        const safeFields = getSafeSelectFields(AppDataSource, Product, fields);
        const product = await this.productRepo.findOne({
            where :{
                id
            },
            select:safeFields
        })
        return product;
    } 

    async deleteProduct(id : bigint) : Promise<void>{
        const result = await this.productRepo.delete({
            id
        });
        if(result.affected === 0){
            throw new AppError("Product Not Found",HTTP_STATUS.NOT_FOUND);
        }
    }

}