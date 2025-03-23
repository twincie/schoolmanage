import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import User from "./user";
import Guardian from "./guardian";
import Class from "./class";

@Entity()
export default class StudentDetails {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: true })
  grade!: string;

  // One-to-one relationship with the User entity
  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  // One-to-one relationship with the Guardian entity
  @OneToOne(() => Guardian, (guardian) => guardian.studentDetails, { cascade: true })
  guardian!: Guardian;

  @OneToOne(() => Class, (cls) => cls.students)
  class!: Class;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt?: Date; // Soft delete column
}