import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, DeleteDateColumn, JoinTable } from "typeorm";
import TeacherDetails from "./teachersDetails";

@Entity()
export default class Subject {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", nullable: false })
    name!: string;

    @ManyToMany(() => TeacherDetails, (teacherDetails) => teacherDetails.subjects)
    @JoinTable()
    teachers!: TeacherDetails[];

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deletedAt?: Date;
}