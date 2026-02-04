import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
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
}
