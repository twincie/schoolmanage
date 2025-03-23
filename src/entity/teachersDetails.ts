import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, DeleteDateColumn } from "typeorm";
import User from "./user";
import NextOfKin from "./nextOfKin";
import Subject from "./subject";
import Class from "./class";

@Entity()
export default class TeacherDetails {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: true })
  qualification!: string;

  @Column({ type: "text", nullable: true })
  specialization!: string;

  @Column({ type: "text", nullable: true })
  experience!: string;

  // One-to-one relationship with the User entity
  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  // One-to-one relationship with the NextOfKin entity
  @OneToOne(() => NextOfKin, (nextOfKin) => nextOfKin.teacherDetails, { cascade: true })
  nextOfKin!: NextOfKin;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
    subjects!: Subject[];

  @OneToOne(() => Class, (cls) => cls.students)
  class!: Class;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deletedAt?: Date;
}