import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany } from "typeorm";
import { Variant } from "./VariantEntity";
import { Collection } from "./CollectionEntity";
import { Order } from "./OrderEntity";
 
@Entity("product")
export class Product {
  @PrimaryGeneratedColumn({type: "bigint"})
  id !: bigint;

  @Column({type : "text"})
  title !: string;
  
  @Column({type : "text"})
  description!: string;

  @Column("text",{array:true})
  tags !: string[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt !: Date;

  @OneToMany(() => Variant, variant => variant.productId)
  variants!: Variant[];

  @ManyToMany(() => Collection, (collection) => collection.products)
  collections!: Collection[];

  @OneToMany(() => Order, order => order.productId)
  orders!: Order[];

}
