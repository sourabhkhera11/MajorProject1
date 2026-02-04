import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Customer } from "../entity/customersEntity";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../utils/constant";
type CustomerSelectableField = keyof Customer; 

export class customersRepository{
    private customerRepo : Repository<Customer>; 

    constructor(){
        this.customerRepo = AppDataSource.getRepository(Customer);
    }

    async insertCustomer(userData:Customer): Promise<Customer>{
        const customer= await this.customerRepo.save({
            name: userData.name,
            phone: userData.phone,
            email: userData.email
        });
        return customer;
    }
    
    async fetchAllCustomers( take : number = 10 , skip : number = 0 , fields? : string[]):Promise<Customer[]> {
        const possibleFields= ['id','name','email','phone','createdAt'];
        const safeFields : any  = (fields) ? fields.filter(field => possibleFields.includes(field)) : undefined;
        const users=await this.customerRepo.find({
            take:take,
            skip:skip,
            select:safeFields
        });
        return users;
    }

    async fetchCustomer(inputId:bigint, fields? : string[]):Promise<Customer | null>{
        const possibleFields= ['id','name','email','phone','createdAt'];
        const safeFields : any  = (fields) ? fields.filter(field => possibleFields.includes(field)) : undefined;
        const customer =await this.customerRepo.findOne({
            where:{
                id:inputId
            },
            select:safeFields
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
