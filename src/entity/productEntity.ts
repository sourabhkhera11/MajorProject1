import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Variant } from "./variantEntity";

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
}
