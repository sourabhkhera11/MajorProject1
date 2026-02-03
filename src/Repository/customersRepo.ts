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
        const user= await this.customerRepo.save({
            name: userData.name,
            phone: userData.phone,
            email: userData.email
        });
        return user.name;
    }
    
    async fetchAllCustomers():Promise<Customer[]> {
        const users=await this.customerRepo.find();
        return users;
    }

    async fetchCustomer(inputId:bigint):Promise<Customer | null>{
        const customer =await this.customerRepo.findOneBy({
            id:inputId
        });
        return customer;
        
    }

    async deleteCustomer(inputId:bigint):Promise<void>{
        const result =await this.customerRepo.delete({id:inputId});
        if(result.affected === 0){
            throw new AppError("Customer not Found",HTTP_STATUS.NOT_FOUND);
        } 
    }

    async updateUserById(inputId:bigint,updateData:Partial<Customer>):Promise<void>{
        const {id,...safeFields}=updateData;
        const result= await this.customerRepo.update({id:inputId},safeFields);
        if(result.affected===0){
            throw new AppError("Customer not found",HTTP_STATUS.NOT_FOUND);
        }
    }

    async isDuplicate(inputEmail:string):Promise<boolean>{
        const customer =await this.customerRepo.findOneBy({
            email:inputEmail
        });
        return (customer) ? true : false;
    }
}
