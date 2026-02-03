import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Products {
  @PrimaryGeneratedColumn({type: "bigint"})
  id !: bigint;

  @Column({type : "text"})
  title !: string;
  
  @Column({type : "text" })
  description!: string;

  @Column("simple-array")
  tags !: string[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt !: Date;
}
