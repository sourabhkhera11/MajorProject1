import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Product } from "./ProductEntity";
import { Customer } from "./CustomersEntity";
import { Variant } from "./VariantEntity";
import { OrderStatus } from "../utils/enums";

@Entity("orders")
export class Order {

  @PrimaryGeneratedColumn({type : "bigint"})
  id!: bigint;

  @Column({type : "enum", enum : OrderStatus})
  status!: OrderStatus;

  @Column("int")
  numberOfUnitsOrdered!: number;

  @Column("decimal")
  totalAmount!: number;

  @CreateDateColumn({ type: "timestamptz" })
    createdAt !: Date;

  @ManyToOne(() => Product, product => product.orders, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({name:"productId"})
  productId!: Product;

  @ManyToOne(() => Variant, variant => variant.orders, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({name:"variantId"})
  variantId!: Variant;

  @ManyToOne(() => Customer, customer => customer.orders, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({name:"customerId"})
  customerId!: Customer;
}
