import { Context } from "node:vm";
import { customersRepository } from "../Repository/customersRepo";
import { isPhone, isEmail,isGender,isDOB, isInterests } from "../utils/helper";
import { HTTP_STATUS } from "../utils/constant";
import { AppError } from "../utils/AppError";

const custRepo = new customersRepository();

export class CustomerController{

    static async createCustomer(ctx: Context){
        const customerData=ctx.request.body;
        const {name,
            phone,
            email 
        }=customerData;
        if(await custRepo.isDuplicate(email)){
            throw new AppError("Duplicate entry",HTTP_STATUS.CONFLICT);
        }
        if(!name){
            throw new AppError("Name is required!",HTTP_STATUS.BAD_REQUEST);
        }
        if (!isPhone(phone)) {
            throw new AppError("Invalid contact number format",HTTP_STATUS.BAD_REQUEST);
        }
        if (!isEmail(email)) {
            throw new AppError("Invalid email format",HTTP_STATUS.BAD_REQUEST);
        }
        const value=await custRepo.insertCustomer(customerData);
        ctx.status=HTTP_STATUS.CREATED;
        ctx.body={
            success:true,
            message: `Welcome ${value}!`
        }
    }
    static async fetchCustomers(ctx: Context){
        const users=await custRepo.fetchAllCustomers();
        ctx.status=HTTP_STATUS.OK;
        ctx.body={
            success:true,
            message: "Data fetched successfully",
            data: users
        }
    }
    static async fetchCustomer(ctx:Context){
        const customer=await custRepo.fetchCustomer(ctx.params.id);
        ctx.status=HTTP_STATUS.OK;
        ctx.body={
            success:true,
            message:"Date fetched successfully",
            data:customer
        }
    }

    static async deleteCustomer(ctx:Context){
        await custRepo.deleteCustomer(ctx.params.id);
        ctx.status=HTTP_STATUS.OK;
        ctx.body={
            success:true,
            message: "Customer deleted successfully"
        }
    }

    static async updateCustomer(ctx:Context){
        await custRepo.updateUserById(ctx.params.id,ctx.request.body);
        ctx.status=HTTP_STATUS.OK;
        ctx.body={
            success:true,
            message:"Customer updated successfully"
        }
    }

}
