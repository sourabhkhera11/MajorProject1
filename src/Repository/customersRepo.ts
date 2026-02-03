import { Repository } from "typeorm";
import {AppDataSource} from "../data-source";
import { Customer } from "../entity/customersEntity";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/constant";

export class customersRepository{
    private customerRepo : Repository<Customer>; 

    constructor(){
        this.customerRepo = AppDataSource.getRepository(Customer);
    }

    async insertCustomer(userData:Customer): Promise<string>{
        try{
            const user= await this.customerRepo.save({
                name: userData.name,
                phone: userData.phone,
                email: userData.email
            });
            return user.name;
        }
        catch(er){
            throw new Error("Failed to insert customer");
        }
    }
    
    async fetchAllCustomers():Promise<Customer[]> {
        try{
            const users=await this.customerRepo.find();
            return users;
        }
        catch(er){
            throw new Error("Failed to fetch customer data!");
        }
    }

    async fetchCustomer(inputId:bigint):Promise<Customer | null>{
        try{
            const customer =await this.customerRepo.findOneBy({
                id:inputId
            });
            return customer;
        }
        catch(er){
            throw new Error("Failed to fetch a particular customer data!");
        }
    }

    async deleteCustomer(inputId:bigint):Promise<void>{
        try{
            const result =await this.customerRepo.delete({id:inputId});
            if(result.affected === 0){
                throw new AppError("Customer not Found",HTTP_STATUS.NOT_FOUND);
            } 
        }
        catch(er:any){
            throw new AppError(er.message,HTTP_STATUS.BAD_REQUEST);
        }
    }

    async updateUserById(inputId:bigint,updateData:Partial<Customer>):Promise<void>{
        try{
            const {id,...safeFields}=updateData;
            const result= await this.customerRepo.update({id:inputId},safeFields);
            if(result.affected===0){
                throw new AppError("Customer not found",HTTP_STATUS.NOT_FOUND);
            }
        }
        catch(er:any){
            throw new AppError(`${er.message}`,HTTP_STATUS.BAD_REQUEST);
        }
    }

    async isDuplicate(inputEmail:string):Promise<boolean>{
        const customer =await this.customerRepo.findOneBy({
            email:inputEmail
        });
        return (customer)?true:false;
    }
}
