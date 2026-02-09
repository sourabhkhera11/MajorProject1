import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "./entity/CustomersEntity";
import { Product } from "./entity/ProductEntity";
import { Variant } from "./entity/VariantEntity";
import { Collection } from "./entity/CollectionEntity";
import { Order } from "./entity/OrderEntity";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "asdf",
  database: "e-commerce",
  synchronize: true,
  entities: [Customer, Product, Variant, Collection, Order],
});
