import { Repository } from "typeorm"
import { Order } from "../entity/orderEntity";
import { Collection } from "../entity/collectionEntity";
import { AppDataSource } from "../data-source";
import { AppError } from "../utils/AppError";
import { getSafeSelectFields } from "../utils/selectFields";
import { HTTP_STATUS } from "../utils/constant";
import { Product } from "../entity/productEntity";

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
}