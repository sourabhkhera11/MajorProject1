import { Repository } from "typeorm"
import { Variant } from "../entity/variantEntity"
import { AppDataSource } from "../data-source";
import { AppError } from "../utils/AppError";
import { getSafeSelectFields } from "../utils/selectFields";
import { HTTP_STATUS } from "../utils/constant";

export class variantRepository{
    
    private variantRepo : Repository<Variant>;

    constructor(){
        this.variantRepo = AppDataSource.getRepository(Variant);
    }

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

    async fetchVariants(take : number =10,skip : number =0, fields?: string[]) : Promise<Variant[]>{
            const safeFields = getSafeSelectFields(AppDataSource, Variant, fields);
            const variant = await this.variantRepo.find({
                take,
                skip,
                select:safeFields
            });
            return variant;
        }
    
        async fetchVariant(id : bigint , fields? : string[]) : Promise<Variant | null>{
            const safeFields = getSafeSelectFields(AppDataSource, Variant, fields);
            const variant = await this.variantRepo.findOne({
                where :{
                    id
                },
                select:safeFields,
            })
            return variant;
        } 
    
        async deleteVariant(id : bigint) : Promise<void>{
            const result = await this.variantRepo.delete({
                id
            });
            if(result.affected === 0){
                throw new AppError("Variant Not Found",HTTP_STATUS.NOT_FOUND);
            }
        }
    
        async updateVariant(inputId : bigint,updateData : Partial<Variant> ) : Promise<void>{
            const result = await this.variantRepo.update({id : inputId},updateData);
            if(result.affected === 0){
                throw new AppError("Variant Not Found",HTTP_STATUS.NOT_FOUND);
            }
        }

        async decrementStock(inputId : bigint) : Promise<void>{
            const result = await this.variantRepo.decrement({id:inputId},"stock",1);
            if(result.affected === 0){
                throw new AppError("Variant Not Found",HTTP_STATUS.NOT_FOUND);
            }
        }
}