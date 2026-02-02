import { Context } from "node:vm";
import { customersRepository } from "../Repository/customersRepo";
import { isPhone, isEmail,isGender,isDOB, isInterests } from "../utils/helper";
import { HTTP_STATUS } from "../utils/constant";

const custRepo = new customersRepository();

export class CustomerController{

    static async createCustomer(ctx: Context){
        try{
            const customerData=ctx.request.body;
            const {name,
            phone,
            email 
            }=customerData;

            if(!name){
                throw new Error("Name is required!");
            }
            if (!isPhone(phone)) {
                throw new Error("Invalid contact number format");
            }
            if (!isEmail(email)) {
                throw new Error("Invalid email format");
            }
            const value=await custRepo.insertCustomer(customerData);
            ctx.status=HTTP_STATUS.CREATED;
            ctx.body={
                message: `Welcome ${value}!`
            }
        }
        catch(er : any){
            ctx.status=HTTP_STATUS.BAD_REQUEST;
            ctx.body={
                message: "Failed to create user",
                error: er.message,
            };
        }
    }
    static async fetchCustomers(ctx: Context){
        try{
            const users=await custRepo.fetchAllCustomers();
            ctx.status=HTTP_STATUS.OK;
            ctx.body={
                message: "Data fetched successfully",
                data: users
            }
        }
        catch(er){
            ctx.status=HTTP_STATUS.BAD_REQUEST;
            ctx.body={
                message: "Bed request",
                eror: er
            }
        }
    }
    static async fetchCustomer(ctx:Context){
        try{
            const customer=await custRepo.fetchCustomer(ctx.params.id);
            ctx.status=HTTP_STATUS.OK;
            ctx.body={
                message:"Date fetched successfully",
                data:customer
            }
        }
        catch(er){
            ctx.status=HTTP_STATUS.BAD_REQUEST;
            ctx.body={
                message: "Bed request",
                eror: er
            }
        }
    }
}
