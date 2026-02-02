import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Gender } from "../utils/enums";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn({type: "bigint"})
  id !: string;

  @Column({type : "varchar"})
  name !: string;
  
  @Column({type : "text", unique: true })
  email!: string;

  @Column({type : "varchar", length : 15, unique : true})
  phone !: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt !: Date;
}
