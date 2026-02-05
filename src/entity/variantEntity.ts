import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./productEntity";
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

  @ManyToOne(() => Product, product => product.variants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({name:"productId"})
  productId!: Product;
}
