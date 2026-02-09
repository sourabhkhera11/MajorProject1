import { orderRepository } from "../Repository/ordersRepo";
import { productRepository } from "../Repository/productsRepo";
import { customersRepository } from "../Repository/customersRepo";
import { variantRepository } from "../Repository/variantsRepo";
import { BaseController } from "./baseController";
import { Context } from "koa";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/constant";
import { isValidStatus } from "../utils/helper";
import { OrderStatus } from "../utils/enums";

const orderRepo = new orderRepository();
const productRepo = new productRepository();
const customerRepo = new customersRepository();
const variantRepo = new variantRepository();


export class OrderController extends BaseController{

    static async createOrder(ctx:Context){
        return OrderController.execute(ctx,async()=>{
            const orderData = (ctx.request as any).body;

            if(!orderData || Object.keys(orderData).length < 1){
                throw new AppError("Invalid input data!",HTTP_STATUS.BAD_REQUEST)
            }

            const {
                numberOfUnitsOrdered,
                totalAmount,
                variantId,
                customerId         
            }=orderData;

            orderData.status=OrderStatus.CONFIRED;

            if(!numberOfUnitsOrdered || numberOfUnitsOrdered < 1){
                throw new AppError("Number of units ordered is required!",HTTP_STATUS.BAD_REQUEST);
            }

            if(!totalAmount){
                throw new AppError("Total amount is required!",HTTP_STATUS.BAD_REQUEST);
            }

            if(!variantId){
                throw new AppError("Variant id is required!",HTTP_STATUS.BAD_REQUEST);
            }

            const variantData = await variantRepo.fetchVariant(variantId);
    
            if(!variantData){
                throw new AppError("Not valid variantId",HTTP_STATUS.BAD_REQUEST);
            }

            console.log(variantData);
            

            console.log(orderData.productId,variantData.productId);
            
            orderData.productId = variantData.productId;

            console.log(orderData.productId,variantData.productId);


            if(variantData.stock === 0){
                throw new AppError("Item is not in stock!",HTTP_STATUS.BAD_REQUEST);
            }

            if(!customerId){
                throw new AppError("Customer id is required!",HTTP_STATUS.BAD_REQUEST);
            }

            const customerData = await customerRepo.fetchCustomer(customerId);

            if(!customerData){
                throw new AppError("Not valid customerId",HTTP_STATUS.BAD_REQUEST);
            }
    
            const value = await orderRepo.createOrders(orderData);

            await variantRepo.decrementStock(variantId);

            return {
                message : "Order created successfully",
                result :  value
            };
        }, HTTP_STATUS.CREATED);
    }
}