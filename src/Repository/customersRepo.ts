import { Repository } from "typeorm";
import {AppDataSource} from "../data-source";
import { User } from "../entity/customersEntity";

export class customersRepository{
    private userRepo : Repository<User>; 

    constructor(){
        this.userRepo = AppDataSource.getRepository(User);
    }

    async insertUser(userData:User): Promise<string>{
        try{
            const user= await this.userRepo.save({
                name: userData.name,
                contactNumber: userData.contactNumber,
                dob: userData.dob,
                gender: userData.gender,
                city: userData.city,
                interests: userData.interests,
                password: userData.password,
                email: userData.email
            });
            return user.name;
        }
        catch(er){
            throw new Error("Failed to insert user");
        }
    }
    
    async fetchAllUser():Promise<User[]> {
        try{
            const users=await this.userRepo.find();
            return users;
        }
        catch(er){
            throw new Error("Failed to fetch data!");
        }
    }
}
