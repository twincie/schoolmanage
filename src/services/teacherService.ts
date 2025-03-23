import { AppDataSource } from "../config/ormconfig";
import User from "../entity/user";
import { IsNull } from "typeorm";
import TeacherDetails from "../entity/teachersDetails";
import NextOfKin from "../entity/nextOfKin";
import Class from "../entity/class";
import Subject from "../entity/subject";

export default class TeacherService {
  private userRepository = AppDataSource.getRepository(User);
  private teacherDetailsRepository = AppDataSource.getRepository(TeacherDetails);
  private nextOfKinRepository = AppDataSource.getRepository(NextOfKin);
  private classRepository = AppDataSource.getRepository(Class);
  private subjectRepository = AppDataSource.getRepository(Subject);

  // Get teacher's profile
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    //   relations: ["teacherDetails", "teacherDetails.nextOfKin"], // Load related teacher details and next of kin
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Update teacher's profile
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

  // Add/Update Next of Kin for a Teacher
  async addOrUpdateNextOfKin(userId: number, data: { name: string; contact: string; relationship?: string }) {
    const teacherDetails = await this.teacherDetailsRepository.findOne({
      where: { user: { id: userId } },
      relations: ["nextOfKin"], // Load the related next of kin
    });

    if (!teacherDetails) {
      throw new Error("Teacher details not found");
    }

    let nextOfKin = teacherDetails.nextOfKin;

    if (nextOfKin) {
      // Update existing next of kin
      Object.assign(nextOfKin, data);
    } else {
      // Create new next of kin
      nextOfKin = this.nextOfKinRepository.create(data);
    }

    teacherDetails.nextOfKin = nextOfKin;
    await this.teacherDetailsRepository.save(teacherDetails);

    return nextOfKin;
  }

  // Get Next of Kin for a Teacher
  async getNextOfKin(userId: number) {
    const teacherDetails = await this.teacherDetailsRepository.findOne({
      where: { user: { id: userId } },
      relations: ["nextOfKin"], // Load the related next of kin
    });

    if (!teacherDetails) {
      throw new Error("Teacher details not found");
    }

    return teacherDetails.nextOfKin;
  }

  async getCurrentClassAndSubjects(userId: number) {
    // Find classes where the teacher is either the head teacher or assistant teacher
    const classes = await this.classRepository.find({
        where: [
            { headTeacher: { id: userId }, deletedAt: IsNull() },
            { assistantTeacher: { id: userId }, deletedAt: IsNull() }
        ],
        relations: ["subjects", "headTeacher", "assistantTeacher"]
    });

    // Find subjects assigned to the teacher
    const subjects = await this.subjectRepository.find({
        where: { teachers: { user: { id: userId } }, deletedAt: IsNull() },
    });

    return {
        classes: classes.map(cls => ({
            id: cls.id,
            name: cls.name,
            headTeacher: cls.headTeacher,
            assistantTeacher: cls.assistantTeacher,
        })),
        subjects: subjects.map(subject => ({
            id: subject.id,
            name: subject.name,
        })),
    };
}
}