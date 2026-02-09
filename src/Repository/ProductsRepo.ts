import { ArrayOverlap, Repository, In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/ProductEntity";
import { getSafeSelectFields } from "../utils/selectFields";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/constant";

export class productRepository{
    
    private productRepo : Repository<Product>

    constructor(){
        this.productRepo = AppDataSource.getRepository(Product);
    }

    async insertProduct(productData: Product): Promise<Product>{
        const product = await this.productRepo.save({
            title: productData.title,
            description: productData.description,
            tags: productData.tags
        })
        return product;
    }

    async fetchProducts(take : number =10,skip : number =0, fields?: string[], tags ?: string[]) : Promise<Product[]>{
        const safeFields = getSafeSelectFields(AppDataSource, Product, fields);
        const where: any = {};

        if (tags && tags.length > 0) {
            where.tags = ArrayOverlap(tags);
        }
        const products = await this.productRepo.find({
            where,
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

    async updateProduct(inputId : bigint,updateData : Partial<Product> ) : Promise<void>{
        const result = await this.productRepo.update({id : inputId},updateData);
        if(result.affected === 0){
            throw new AppError("Product Not Found",HTTP_STATUS.NOT_FOUND);
        }
    }

    async productWithVariants() : Promise<Product[]> {
        const result = await this.productRepo.find({
            relations:{
                variants:true
            }
        })
        return result;
    }

    async fetchFromProductArray(productIds : bigint[]) : Promise<Product[]>{
        const existingProducts = await this.productRepo.findBy({
            id : In(productIds) 
        });
        return existingProducts;
    }

    async totalSalesOfProduct(productId : bigint) : Promise<Product | null>{
        const product = await this.productRepo.findOne({
            where : {
                id : productId
            },
            relations :{
                orders : true
            },
            select : {
                id : true,
                title : true,
                orders : {
                    totalAmount : true,
                    numberOfUnitsOrdered :true,
                    id : true
                }
            }
        })
        return product;
    }
}