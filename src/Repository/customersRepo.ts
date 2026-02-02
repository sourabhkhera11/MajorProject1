import { Repository } from "typeorm";
import {AppDataSource} from "../data-source";
import { Customer } from "../entity/customersEntity";

export class customersRepository{
    private customerRepo : Repository<Customer>; 

    constructor(){
        this.customerRepo = AppDataSource.getRepository(Customer);
    }

    async insertUser(userData:Customer): Promise<string>{
        try{
            const user= await this.customerRepo.save({
                name: userData.name,
                contactNumber: userData.phone,
                email: userData.email
            });
            return user.name;
        }
        catch(er){
            throw new Error("Failed to insert customer");
        }
    }
    
    async fetchAllUser():Promise<Customer[]> {
        try{
            const users=await this.customerRepo.find();
            return users;
        }
        catch(er){
            throw new Error("Failed to fetch customer data!");
        }
    }
}
