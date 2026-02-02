import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Gender } from "../utils/enums";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id !: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt !: Date;

  @Column({type : "varchar"})
  name !: string;

  @Column({type : "varchar", length : 15, unique : true})
  contactNumber !: string;

  @Column({type : "date"})
  dob !: string;

  @Column({type : "text", unique: true })
  email!: string;
  
  @Column({type : "enum", enum : Gender})
  gender !: Gender;

  @Column({type : "varchar", length : 50})
  city !: string;

  @Column("simple-array")
  interests !: string[];

  @Column({type : "text"})
  password!:string;

}
