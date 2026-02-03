import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "./entity/customersEntity";
import { Products } from "./entity/productsEntity";
export const AppDataSource = new DataSource({
  type: "postgres", 
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "asdf",
  database: "e-commerce",
  synchronize: true, 
  entities: [Customer,Products],
});
