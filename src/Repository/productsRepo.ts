import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/productEntity";
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
}