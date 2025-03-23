import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", nullable: false })
    username!: string;

    @Column({ type: "text", nullable: false })
    email!: string;

    @Column({ type: "text", nullable: false})
    role!: string;

    @Column({ type: "text", nullable: false })
    password!: string;

    @DeleteDateColumn({ name: "deleted_at", nullable: true }) // Soft delete column
    deletedAt?: Date;
}