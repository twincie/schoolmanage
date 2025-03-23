import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import StudentDetails from "./studentDetails";

@Entity()
export default class Guardian {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false })
  contact!: string;

  @Column({ type: "text", nullable: true })
  relationship!: string; // e.g., "Parent", "Guardian"

  // One-to-one relationship with StudentDetails
  @OneToOne(() => StudentDetails, (studentDetails) => studentDetails.guardian)
  @JoinColumn()
  studentDetails!: StudentDetails;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt?: Date; // Soft delete column
}