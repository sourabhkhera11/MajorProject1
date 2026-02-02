import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/customersEntity";
export const AppDataSource = new DataSource({
  type: "postgres", 
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "asdf",
  database: "project1",
  synchronize: true, 
  entities: [User],
});
