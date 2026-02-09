import { orderRepository } from "../Repository/OrdersRepo";
import { productRepository } from "../Repository/ProductsRepo";
import { customersRepository } from "../Repository/CustomersRepo";
import { variantRepository } from "../Repository/VariantsRepo";
import { BaseController } from "./BaseController";
import { Context } from "koa";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/Constant";
import { isValidStatus } from "../utils/Helper";
import { OrderStatus } from "../utils/Enums";

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

            orderData.productId = variantData.productId.id;

            if(variantData.stock < 1){
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

    static async fetchOrders(ctx:Context){
            return OrderController.execute(ctx,async()=>{
                const take = ctx.query.take ? Number(ctx.query.take) : undefined;
                const skip = ctx.query.skip ? Number(ctx.query.skip) : undefined;
                const fields = ctx.query.fields ? (ctx.query.fields as string).split(",") : [] as string[];
                const orders = await orderRepo.fetchOrders(take,skip,fields);
                if(!orders){
                    throw new AppError("No order found",HTTP_STATUS.NOT_FOUND);
                }
                return {
                    message : "Data fetched successfully!",
                    result : orders
                } 
            },HTTP_STATUS.OK)
        }
    
        static async fetchOrder(ctx:Context){
            return OrderController.execute(ctx,async()=>{
                const fields = ctx.query.fields ? (ctx.query.fields as string).split(",") : [] as string[];
                const order = await orderRepo.fetchOrder(ctx.params.id,fields);
                if(!order){
                    throw new AppError("No order found",HTTP_STATUS.NOT_FOUND);
                }
                return {
                    message : "Data fetched successfully!",
                    result : order
                }
            },HTTP_STATUS.OK)
        }
    
        static async deleteOrder(ctx:Context){
            return OrderController.execute(ctx,async()=>{
                await orderRepo.deleteOrder(ctx.params.id);
                return{
                    message : "Order deleted successfully!",
                }
            },HTTP_STATUS.OK) 
        }
    
        static async updateOrder(ctx:Context){
            return OrderController.execute(ctx,async()=>{
                const orderData=(ctx.request as any).body;
                if(!orderData || Object.keys(orderData).length<1){
                    throw new AppError("Invalid input data",HTTP_STATUS.BAD_REQUEST);
                }
                const{
                    status,
                }=orderData;
                const safeFields={
                    status:status
                }

                console.log("status",status,typeof status);

                if(!isValidStatus(status)){
                    throw new AppError("Invalid status!",HTTP_STATUS.BAD_REQUEST);
                }

                const existingOrder =await orderRepo.fetchOrder(ctx.params.id);

                console.log(existingOrder);
                
                if(!existingOrder){
                    throw new AppError("Order not exist",HTTP_STATUS.NOT_FOUND);
                }

                const diffInMs = Date.now() - existingOrder.createdAt.getDate();
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                
                if(diffInDays > 10 && status === OrderStatus.RETURNED){
                    throw new AppError("Can't be returned now!",HTTP_STATUS.BAD_REQUEST);
                }

                const existingStatus = existingOrder.status;

                console.log("existingStatus",existingStatus,typeof existingStatus);
                

                const statusCancelable = [OrderStatus.CONFIRED,OrderStatus.SHIPPED,OrderStatus.OUT_FOR_DELIVERY];

                if((status === OrderStatus.CONFIRED || existingStatus === OrderStatus.REFUNDED || existingStatus === OrderStatus.CANCELLED) ||
                    (status === OrderStatus.SHIPPED && existingStatus != OrderStatus.CONFIRED) ||
                    (status === OrderStatus.OUT_FOR_DELIVERY && existingStatus != OrderStatus.SHIPPED) ||
                    (status === OrderStatus.DELIVERED && existingStatus != OrderStatus.OUT_FOR_DELIVERY) ||
                    (status === OrderStatus.CANCELLED && !statusCancelable.includes(existingStatus)) || 
                    (status === OrderStatus.RETURNED && existingStatus != OrderStatus.DELIVERED) ||
                    (status === OrderStatus.REFUNDED && existingStatus != OrderStatus.RETURNED) ){
                    throw new AppError("Not a valid status",HTTP_STATUS.BAD_REQUEST);
                }
                
                await orderRepo.updateOrder(ctx.params.id,safeFields)
                return{
                    message : "Order updated successfully"
                }
            },HTTP_STATUS.OK)
        }
}