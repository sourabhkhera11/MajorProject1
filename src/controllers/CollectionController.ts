import { BaseController } from "./BaseController";
import { collectionRepository } from "../Repository/CollectionRepo";
import { Context } from "koa";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/Constant";
import { productRepository } from "../Repository/ProductsRepo";

const collectionRepo = new collectionRepository();
const productRepo = new productRepository();

export class CollectionController extends BaseController{

    static async createCollection(ctx:Context){
            return CollectionController.execute(ctx,async()=>{
                const collectionData = (ctx.request as any).body;
                console.log(collectionData);
                
                if(!collectionData || Object.keys(collectionData).length < 1){
                    throw new AppError("Invalid input data!",HTTP_STATUS.BAD_REQUEST)
                }
    
                const {
                    title
                }=collectionData;
    
                if(!title){
                    throw new AppError("Title is required!",HTTP_STATUS.BAD_REQUEST);
                }
                
                const value = await collectionRepo.createCollections(collectionData);
                return {
                    message : "Collection created successfully",
                    result :  value
                };
            }, HTTP_STATUS.CREATED);
        }

        static async fetchCollections(ctx:Context){
                return CollectionController.execute(ctx,async()=>{
                    const take = ctx.query.take ? Number(ctx.query.take) : undefined;
                    const skip = ctx.query.skip ? Number(ctx.query.skip) : undefined;
                    const fields = ctx.query.fields ? (ctx.query.fields as string).split(",") : [] as string[];
                    const collections = await collectionRepo.fetchCollections(take,skip,fields);
                    if(!collections){
                        throw new AppError("No collection found",HTTP_STATUS.NOT_FOUND);
                    }
                    return {
                        message : "Data fetched successfully!",
                        result : collections
                    } 
                },HTTP_STATUS.OK)
            }
        
            static async fetchCollection(ctx:Context){
                return CollectionController.execute(ctx,async()=>{
                    const fields = ctx.query.fields ? (ctx.query.fields as string).split(",") : [] as string[];
                    const collection = await collectionRepo.fetchCollection(ctx.params.id,fields);
                    if(!collection){
                        throw new AppError("No collection found",HTTP_STATUS.NOT_FOUND);
                    }
                    return {
                        message : "Data fetched successfully!",
                        result : collection
                    }
                },HTTP_STATUS.OK)
            }
        
            static async deleteCollection(ctx:Context){
                return CollectionController.execute(ctx,async()=>{
                    await collectionRepo.deleteCollection(ctx.params.id);
                    return{
                        message : "Collection deleted successfully!",
                    }
                },HTTP_STATUS.OK) 
            }
        
            static async updateCollection(ctx:Context){
                return CollectionController.execute(ctx,async()=>{
                    const collectionData=(ctx.request as any).body;
                    if(!collectionData || Object.keys(collectionData).length<1){
                        throw new AppError("Invalid input data",HTTP_STATUS.BAD_REQUEST);
                    }

                    const{
                        title,
                    }=collectionData;
                    const safeFields={
                        title:title,
                    }

                    await collectionRepo.updateCollection(ctx.params.id,safeFields)
                    return{
                        message : "Collection updated successfully"
                    }
                },HTTP_STATUS.OK)
            }

            static async addProductToCollection(ctx:Context){
                return CollectionController.execute(ctx,async()=>{

                    const productIds  = (ctx.request  as any).body.productId;
                    
                    const collectionId = ctx.params.id;

                    if (!Array.isArray(productIds) || productIds.length === 0) {
                        throw new AppError("productId must be a non-empty array", HTTP_STATUS.BAD_REQUEST);
                    }

                    const collection = await collectionRepo.fetchCollection(collectionId,[],true);

                    if(!collection){
                        throw new AppError("Collection not found!",HTTP_STATUS.BAD_REQUEST);
                    }


                    const existingProduct = await productRepo.fetchFromProductArray(productIds);
                    
                    const existingProductIds = existingProduct.map(p => p.id);
                    
                    const notExistingProductIds = productIds.filter(
                        id => !existingProductIds.includes(id.toString())
                    )                    
                    
                    const alreadyLinkedIds = collection.products
                        .filter(p => existingProductIds.includes(p.id))
                        .map(p => p.id);

                    const productsToAdd = existingProduct.filter(
                        p => !collection.products.some(cp => cp.id === p.id)
                    );

                    const result = await collectionRepo.addProductToCollection(collection,productsToAdd);
                    return{
                        message : "Product is added to the collection",
                        results : result,
                        productAdd : productsToAdd.map(p => p.id),
                        notExistingProduct : notExistingProductIds,
                        alreadyLinkedProdcuts : alreadyLinkedIds 
                    }

                },HTTP_STATUS.OK)
            }

            static async collectionWithProducts(ctx:Context){
                return CollectionController.execute(ctx,async()=>{
                    const result = await collectionRepo.fetchCollectionWithProduct();
                    if(!result){
                        throw new AppError("No collection found",HTTP_STATUS.NOT_FOUND);
                    }
                    return {
                        message : "Data fetched successfully!",
                        result : result
                    }
                },HTTP_STATUS.OK);
            }
        
}