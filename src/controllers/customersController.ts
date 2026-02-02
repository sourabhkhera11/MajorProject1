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
                message: `Welcome ${value}!`
            }
    }
    static async fetchCustomers(ctx: Context){
            const users=await custRepo.fetchAllCustomers();
            ctx.status=HTTP_STATUS.OK;
            ctx.body={
                message: "Data fetched successfully",
                data: users
            }
    }
    static async fetchCustomer(ctx:Context){
            const customer=await custRepo.fetchCustomer(ctx.params.id);
            ctx.status=HTTP_STATUS.OK;
            ctx.body={
                message:"Date fetched successfully",
                data:customer
            }
    }
}
