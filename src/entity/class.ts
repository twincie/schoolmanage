import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, DeleteDateColumn } from "typeorm";
import User from "./user";
import Subject from "./subject";

@Entity()
export default class Class {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", nullable: false })
    name!: string;

    @ManyToOne(() => User, { nullable: true })
    headTeacher!: User;

    @ManyToOne(() => User, { nullable: true })
    assistantTeacher!: User;

    @ManyToMany(() => User)
    @JoinTable()
    students!: User[];

    @ManyToMany(() => Subject)
    @JoinTable()
    subjects!: Subject[];

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deletedAt?: Date;
}