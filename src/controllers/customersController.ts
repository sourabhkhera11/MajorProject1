import { customersRepository } from "../Repository/customersRepo";
import { isPhone, isEmail,isGender,isDOB, isInterests } from "../utils/helper";
import { HTTP_STATUS } from "../utils/constant";
import { AppError } from "../utils/AppError";
import { BaseController } from "./baseController";
import { Context } from "koa";

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

            if (!name) {
                throw new AppError("Name is required!",HTTP_STATUS.BAD_REQUEST);
            }

            if (!isPhone(phone)) {
                throw new AppError("Invalid contact number format",HTTP_STATUS.BAD_REQUEST);
            }

            if (await custRepo.isDuplicate(email)) {
                throw new AppError("Duplicate entry",HTTP_STATUS.CONFLICT);
            }

            if (!isEmail(email)) {
                throw new AppError("Invalid email format",HTTP_STATUS.BAD_REQUEST);
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
                data: customers
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
            await custRepo.updateUserById(ctx.params.id,customerData);
            return{
                message:"Customer updated successfully"
            }
        },HTTP_STATUS.OK)
    }
}
