import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn({type: "bigint"})
  id !: bigint;

  @Column({type : "varchar"})
  title !: string;
  
  @Column({type : "text"})
  description!: string;

  @Column({type : "simple-array"})
  tags !: string[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt !: Date;
}
