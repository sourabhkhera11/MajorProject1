import { Context } from "node:vm";
import { customersRepository } from "../Repository/customersRepo";
import { isPhone, isEmail,isGender,isDOB, isInterests } from "../utils/helper";
import { HTTP_STATUS } from "../utils/constant";
import { AppError } from "../utils/AppError";
import { BaseController } from "./baseController";

const custRepo = new customersRepository();

export class CustomerController extends BaseController{ 

    static async createCustomer(ctx: Context){
        return BaseController.execute(ctx, async()=>{
            const customerData=ctx.request.body;
            const {name,
                phone,
                email 
            }=customerData;
            if(!name){
                throw new AppError("Name is required!",HTTP_STATUS.BAD_REQUEST);
            }
            if (!isPhone(phone)) {
                throw new AppError("Invalid contact number format",HTTP_STATUS.BAD_REQUEST);
            }
            if(await custRepo.isDuplicate(email)){
                throw new AppError("Duplicate entry",HTTP_STATUS.CONFLICT);
            }
            if (!isEmail(email)) {
                throw new AppError("Invalid email format",HTTP_STATUS.BAD_REQUEST);
            }
            const value=await custRepo.insertCustomer(customerData);
            return {
                message:"Customer created successfully",
                result:value
            };
        },HTTP_STATUS.CREATED);
    }
    static async fetchCustomers(ctx: Context){
        return BaseController.execute(ctx,async()=>{
            const customers=await custRepo.fetchAllCustomers();
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
            const customer=await custRepo.fetchCustomer(ctx.params.id);
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
            await custRepo.updateUserById(ctx.params.id,ctx.request.body);
            return{
                message:"Customer updated successfully"
            }
        },HTTP_STATUS.OK)
    }
}
