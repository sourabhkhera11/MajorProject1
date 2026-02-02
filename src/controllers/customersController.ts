import { Context } from "node:vm";
import { customersRepository } from "../Repository/customersRepo";
import { isPhone, isEmail,isGender,isDOB, isInterests } from "../utils/helper";
import { HTTP_STATUS } from "../utils/constant";

const custRepo = new customersRepository();

export class UserController{

    static async createUser(ctx: Context){
        try{
            const userData=ctx.request.body;
            const {name,
            contactNumber,
            dob,
            gender,
            city,
            interests, 
            password,
            email 
            }=userData;

            if(!name){
                throw new Error("Name is required!");
            }
            if(!city){
                throw new Error("City is required");
            }
            if (!isPhone(contactNumber)) {
                throw new Error("Invalid contact number format");
            }
            if (!isEmail(email)) {
                throw new Error("Invalid email format");
            }
            if (!isGender(gender)){
                throw new Error("Invalid gender!");
            }
            if(!isDOB(new Date(dob)) ){
                throw  new Error("Not a valid dob!");
            }
            if(!isInterests(interests)){
                throw new Error("Must have at least one interest!");
            }
            const value=await custRepo.insertUser(userData);
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
    static async fetchUsers(ctx: Context){
        try{
            const users=await custRepo.fetchAllUser();
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
}
