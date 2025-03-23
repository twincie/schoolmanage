import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import TeacherDetails from "./teachersDetails";

@Entity()
export default class NextOfKin {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false })
  contact!: string;

  @Column({ type: "text", nullable: true })
  relationship!: string; // e.g., "Spouse", "Sibling"

  // One-to-one relationship with TeacherDetails
  @OneToOne(() => TeacherDetails, (teacherDetails) => teacherDetails.nextOfKin)
  @JoinColumn()
  teacherDetails!: TeacherDetails;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt?: Date; // Soft delete column
}