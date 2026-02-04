import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("customer")
export class Customer {
  @PrimaryGeneratedColumn({type: "bigint"})
  id !: bigint;

  @Column({type : "varchar"})
  name !: string;
  
  @Column({type : "text", unique: true })
  email!: string;

  @Column({type : "varchar", length : 15})
  phone !: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt !: Date;
}
