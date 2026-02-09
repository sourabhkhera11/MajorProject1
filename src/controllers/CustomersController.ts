import { customersRepository } from "../Repository/CustomersRepo";
import { isPhone, isEmail,isGender,isDOB, isInterests } from "../utils/Helper";
import { HTTP_STATUS } from "../utils/Constant";
import { AppError } from "../utils/AppError";
import { BaseController } from "./BaseController";
import { Context } from "koa";
import { accessSync } from "node:fs";

const custRepo = new customersRepository();

export class CustomerController extends BaseController{ 

    static async createCustomer(ctx: Context){
        return CustomerController.execute(ctx, async()=>{
            const customerData = (ctx.request as any).body;
            if(!customerData || Object.keys(customerData).length<1){
                throw new AppError("Invalid input data",HTTP_STATUS.BAD_REQUEST);
            }
            const {name,
                phone,
                email 
            }=customerData;
            console.log(name, typeof name);
            
            if (!name) {
                throw new AppError("Name is required!",HTTP_STATUS.BAD_REQUEST);
            }

            if (!isPhone(phone)) {
                throw new AppError("Invalid contact number!",HTTP_STATUS.BAD_REQUEST);
            }

            if (await custRepo.isDuplicate(email)) {
                throw new AppError("Duplicate entry!",HTTP_STATUS.CONFLICT);
            }

            if (!isEmail(email)) {
                throw new AppError("Invalid email!",HTTP_STATUS.BAD_REQUEST);
            }
            const value = await custRepo.insertCustomer(customerData);
            return {
                message:"Customer created successfully",
                result:value
            };
        }, HTTP_STATUS.CREATED);
    }
    static async fetchCustomers(ctx: Context){
        return CustomerController.execute(ctx,async()=>{
            const fields = ctx.query.fields ? (ctx.query.fields as string).split(',') : []  ;
            const take = ctx.query.take ? Number(ctx.query.take) : undefined ;
            const skip = ctx.query.skip ? Number(ctx.query.skip) : undefined;
            const customers=await custRepo.fetchAllCustomers(take,skip,fields);
            if(!customers){
                throw new AppError("No customer found",HTTP_STATUS.NOT_FOUND);
            }
            return {
                message: "Data fetched successfully",
                result: customers
            }
        },HTTP_STATUS.OK)
    }
    static async fetchCustomer(ctx:Context){
        return BaseController.execute(ctx,async()=>{
            const fields = ctx.query.fields ? (ctx.query.fields as string).split(',') : []  ;
            const customer=await custRepo.fetchCustomer(ctx.params.id, fields);
            if(!customer){
                throw new AppError("Customer not found",HTTP_STATUS.NOT_FOUND);
            }
            return {
                message:"Date fetched successfully",
                data:customer
            }
        },HTTP_STATUS.OK)
    }

    static async deleteCustomer(ctx:Context){
        return BaseController.execute(ctx,async()=>{
            await custRepo.deleteCustomer(ctx.params.id);
            return {
                message: "Customer deleted successfully"
            }
        },HTTP_STATUS.OK)
    }

    static async updateCustomer(ctx:Context){
        return BaseController.execute(ctx,async ()=>{
            const customerData=(ctx.request as any).body;
            if(!customerData || Object.keys(customerData).length<1){
                throw new AppError("Invalid input data",HTTP_STATUS.BAD_REQUEST);
            }
            const{
                name,
                email,
                phone
            } = customerData;
            const safeFields = {
                name:name,
                email:email,
                phone:phone
            }
            await custRepo.updateCustomerById(ctx.params.id,safeFields);
            return{ 
                message:"Customer updated successfully"
            }
        },HTTP_STATUS.OK)
    }

    static async allOrdersWithProductName(ctx:Context){
        return CustomerController.execute(ctx,async ()=>{
            const customer = await custRepo.allOrdersOfCustomer(ctx.params.id);
            if(!customer){
                throw new AppError("Customer not found",HTTP_STATUS.NOT_FOUND);
            }
            return{
                message:"Data fetch successfully!",
                results : customer
            }
        },HTTP_STATUS.OK)
    }

    static async totalSpendByCustomer(ctx:Context){
        return CustomerController.execute(ctx,async ()=>{
            const customer = await custRepo.allOrdersOfCustomer(ctx.params.id);
            if(!customer){
                throw new AppError("Customer not found",HTTP_STATUS.NOT_FOUND);
            }
            const spend = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount),0 );
            return{
                message :"Total spent calculated successfully!",
                totalSpent : spend
            }
        },HTTP_STATUS.OK)
    }
}