import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn ,OneToMany } from "typeorm";
import { Product } from "./productEntity";
import { Order } from "./orderEntity";
@Entity("variants")
export class Variant {

  @PrimaryGeneratedColumn({type : "bigint"})
  id!: bigint;

  @Column({ unique: true })
  sku!: string;

  @Column("decimal")
  price!: number;

  @Column("int")
  stock!: number;

  @Column({ type: "jsonb" })
  attributes!: Record<string, any>;
  
  @OneToMany(() => Order, order => order.variantId)
  orders!: Order[];

  @ManyToOne(() => Product, product => product.variants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({name:"productId"})
  productId!: Product;

}
