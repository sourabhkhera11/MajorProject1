import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "./entity/customersEntity";
import { Product } from "./entity/productEntity";
import { Variant } from "./entity/variantEntity";
import { Collections } from "./entity/collectionEntity"
export const AppDataSource = new DataSource({
  type: "postgres", 
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "asdf",
  database: "e-commerce",
  synchronize: true, 
  entities: [Customer,Product,Variant,Collections],
});
