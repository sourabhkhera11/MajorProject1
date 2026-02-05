import { Repository } from "typeorm"
import { Variant } from "../entity/variantEntity"
import { AppDataSource } from "../data-source";
import { Product } from "../entity/productEntity";
export class variantRepository{
    //properties 
    private variantRepo : Repository<Variant>;

    //Constructor 
    constructor(){
        this.variantRepo = AppDataSource.getRepository(Variant);
    }

    //Methods 
    async createVariants(variantData : Variant) : Promise<Variant>{
         const variant = this.variantRepo.save({
        sku: variantData.sku,
        price: variantData.price,
        stock: variantData.stock,
        attributes: variantData.attributes,
        productId: variantData.productId, 
    });
        return variant;
    }
}