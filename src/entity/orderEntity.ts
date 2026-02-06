// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
// import { Product } from "./productEntity";
// @Entity("variants")
// export class Variant {

//   @PrimaryGeneratedColumn({type : "bigint"})
//   id!: bigint;

//   @Column({ unique: true })
//   sku!: string;

//   @Column("int")
//   numberOfUnitsOrdered!: number;

//   @Column("decimal")
//   totalAmount!: number;

//   @CreateDateColumn({ type: "timestamptz" })
//     createdAt !: Date;

//   @ManyToOne(() => Product, product => product.variants, {
//     nullable: false,
//     onDelete: "CASCADE",
//   })
//   @JoinColumn({name:"productId"})
//   productId!: Product;
// }
