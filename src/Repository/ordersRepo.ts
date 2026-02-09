import { Repository } from "typeorm"
import { Order } from "../entity/orderEntity";
import { Collection } from "../entity/collectionEntity";
import { AppDataSource } from "../data-source";
import { AppError } from "../utils/AppError";
import { getSafeSelectFields } from "../utils/selectFields";
import { HTTP_STATUS } from "../utils/constant";

export class orderRepository{
    
    private orderRepo : Repository<Order>;

    constructor(){
        this.orderRepo = AppDataSource.getRepository(Order);
    }

    async createOrders(orderData : Order) : Promise<Order>{
        const order = this.orderRepo.save({
        status : orderData.status,
        numberOfUnitsOrdered : orderData.numberOfUnitsOrdered,
        totalAmount : orderData.totalAmount,
        productId : orderData.productId,
        variantId : orderData.variantId,
        customerId : orderData.customerId
    });
        return order;
    }

    async fetchOrders(take : number =10,skip : number =0, fields?: string[]) : Promise<Order[]>{
        const safeFields = getSafeSelectFields(AppDataSource, Order, fields);

        const orders = await this.orderRepo.find({
            take,
            skip,
            select:safeFields
        });
        return orders;
    }

    async fetchOrder(id : bigint , fields? : string[]) : Promise<Order | null>{
        const safeFields = getSafeSelectFields(AppDataSource, Order, fields);
        const order = await this.orderRepo.findOne({
            where :{
                id
            },
            select:safeFields
        })
        return order;
    } 

    async deleteOrder(id : bigint) : Promise<void>{
        const result = await this.orderRepo.delete({
            id
        });
        if(result.affected === 0){
            throw new AppError("Order Not Found",HTTP_STATUS.NOT_FOUND);
        }
    }

    async updateOrder(inputId : bigint,updateData : Partial<Order> ) : Promise<void>{
        const result = await this.orderRepo.update({id : inputId},updateData);
        if(result.affected === 0){
            throw new AppError("Order Not Found",HTTP_STATUS.NOT_FOUND);
        }
    }    
}