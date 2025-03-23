import { AppDataSource } from "../config/ormconfig";
import User from "../entity/user";
import { IsNull } from "typeorm";
import StudentDetails from "../entity/studentDetails";
import Guardian from "../entity/guardian";
import Class from "../entity/class";

export default class StudentService {
  private userRepository = AppDataSource.getRepository(User);
  private studentDetailsRepository = AppDataSource.getRepository(StudentDetails);
  private guardianRepository = AppDataSource.getRepository(Guardian);
  private classRepository = AppDataSource.getRepository(Class);

  // Get student's profile
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
      // relations: ["studentDetails", "studentDetails.guardian"], // Load related student details and guardian
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Update student's profile
  async updateProfile(userId: number, data: { username?: string; email?: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId, deletedAt: IsNull() } });

    if (!user) {
      throw new Error("User not found");
    }

    user.username = data.username || user.username;
    user.email = data.email || user.email;
    await this.userRepository.save(user);

    return user;
  }

  // Add/Update Guardian for a Student
  async addOrUpdateGuardian(userId: number, data: { name: string; contact: string; relationship?: string }) {
    const studentDetails = await this.studentDetailsRepository.findOne({
      where: { user: {id: userId } },
      relations: ["guardian"], // Load the related guardian
    });

    if (!studentDetails) {
      throw new Error("Student details not found");
    }

    let guardian = studentDetails.guardian;

    if (guardian) {
      // Update existing guardian
      Object.assign(guardian, data);
    } else {
      // Create new guardian
      guardian = this.guardianRepository.create(data);
    }

    studentDetails.guardian = guardian;
    await this.studentDetailsRepository.save(studentDetails);

    return guardian;
  }

  // Get Guardian for a Student
  async getGuardian(userId: number) {
    const studentDetails = await this.studentDetailsRepository.findOne({
      where: { user: { id: userId }},
      relations: ["guardian"], // Load the related guardian
    });

    if (!studentDetails) {
      throw new Error("Student details not found");
    }

    return studentDetails.guardian;
  }

  // Get current class and subjects for a student
  async getCurrentClassAndSubjects(userId: number) {
    // Find the student's details
    const studentDetails = await this.studentDetailsRepository.findOne({
        where: { user: { id: userId }, deletedAt: IsNull() },
    });

    if (!studentDetails) {
        throw new Error("Student details not found");
    }

    // Find the class where the student is assigned
    const currentClass = await this.classRepository.findOne({
        where: { students: { id: userId }, deletedAt: IsNull() },
        relations: ["subjects", "headTeacher", "assistantTeacher"]
    });

    if (!currentClass) {
        throw new Error("Class not found for the student");
    }

    const subjects = currentClass.subjects;

    return {
        class: {
            id: currentClass.id,
            name: currentClass.name,
            headTeacher: currentClass.headTeacher,
            assistantTeacher: currentClass.assistantTeacher,
        },
        subjects: subjects.map(subject => ({
            id: subject.id,
            name: subject.name,
        })),
    };
}
}