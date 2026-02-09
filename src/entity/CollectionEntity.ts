import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Product } from "./ProductEntity";

@Entity("collection")
export class Collection {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: bigint;

  @Column({ type: "varchar" })
  title!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @ManyToMany(() => Product, (product) => product.collections)
  @JoinTable()
  products!: Product[];
}
