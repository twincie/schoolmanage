import { IsNull, In } from "typeorm";
import { AppDataSource } from "../config/ormconfig";
import Class from "../entity/class";
import User from "../entity/user";
import Subject from "../entity/subject";
import TeacherDetails from "../entity/teachersDetails";

export default class ClassService {
    private classRepository = AppDataSource.getRepository(Class);
    private userRepository = AppDataSource.getRepository(User);
    private subjectRepository = AppDataSource.getRepository(Subject);
    private teacherDetailsRepository = AppDataSource.getRepository(TeacherDetails);

    // Create a single class
    async createClass(name: string, headTeacherId?: number, assistantTeacherId?: number) {
        const cls = new Class();
        cls.name = name;

        if (headTeacherId) {
            const teacherDetails = await this.teacherDetailsRepository.findOne({
                where: { id: headTeacherId, deletedAt: IsNull() },
                relations: ["user"]
            });
            if (teacherDetails) {
                cls.headTeacher = teacherDetails.user;
            }
        }

        if (assistantTeacherId) {
            const teacherDetails = await this.teacherDetailsRepository.findOne({
                where: { id: assistantTeacherId, deletedAt: IsNull() },
                relations: ["user"]
            });
            if (teacherDetails) {
                cls.assistantTeacher = teacherDetails.user;
            }
        }

        return await this.classRepository.save(cls);
    }

    // Create multiple classes
    async createClasses(classData: { name: string; headTeacherId?: number; assistantTeacherId?: number }[]) {
        const classes = await Promise.all(
            classData.map(async (data) => {
                const cls = new Class();
                cls.name = data.name;

                if (data.headTeacherId) {
                    const teacherDetails = await this.teacherDetailsRepository.findOne({
                        where: { id: data.headTeacherId, deletedAt: IsNull() },
                        relations: ["user"]
                    });
                    if (teacherDetails) {
                        cls.headTeacher = teacherDetails.user;
                    }
                }

                if (data.assistantTeacherId) {
                    const teacherDetails = await this.teacherDetailsRepository.findOne({
                        where: { id: data.assistantTeacherId, deletedAt: IsNull() },
                        relations: ["user"]
                    });
                    if (teacherDetails) {
                        cls.assistantTeacher = teacherDetails.user;
                    }
                }

                return cls;
            })
        );

        return await this.classRepository.save(classes);
    }

    // Assign subjects to a class
    async assignSubjects(classId: number, subjectIds: number[]) {
        const cls = await this.classRepository.findOne({
            where: { id: classId, deletedAt: IsNull() },
            relations: ["subjects"]
        });

        if (cls) {
            const subjects = await this.subjectRepository.findBy({ id: In(subjectIds), deletedAt: IsNull() });
            cls.subjects = subjects;
            return await this.classRepository.save(cls);
        }
        return null;
    }

    // Assign students to a class
    async assignStudents(classId: number, studentIds: number[]) {
        const cls = await this.classRepository.findOne({
            where: { id: classId, deletedAt: IsNull() },
            relations: ["students"]
        });

        if (cls) {
            const students = await this.userRepository.findBy({ id: In(studentIds), deletedAt: IsNull() });
            cls.students = students;
            return await this.classRepository.save(cls);
        }
        return null;
    }

    // Update teachers in a class
    async updateClassTeachers(classId: number, headTeacherId?: number, assistantTeacherId?: number) {
        const cls = await this.classRepository.findOne({ where: { id: classId, deletedAt: IsNull() } });
        if (cls) {
            if (headTeacherId) {
                const teacherDetails = await this.teacherDetailsRepository.findOne({
                    where: { id: headTeacherId, deletedAt: IsNull() },
                    relations: ["user"]
                });
                if (teacherDetails) {
                    cls.headTeacher = teacherDetails.user;
                }
            }
            if (assistantTeacherId) {
                const teacherDetails = await this.teacherDetailsRepository.findOne({
                    where: { id: assistantTeacherId, deletedAt: IsNull() },
                    relations: ["user"]
                });
                if (teacherDetails) {
                    cls.assistantTeacher = teacherDetails.user;
                }
            }
            return await this.classRepository.save(cls);
        }
        return null;
    }

    // Get class details (students, head teacher, assistant teacher, subjects)
    async getClassDetails(classId: number) {
        return await this.classRepository.findOne({
            where: { id: classId, deletedAt: IsNull() },
            relations: ["headTeacher", "assistantTeacher", "students", "subjects"]
        });
    }

    // Soft delete a class
    async deleteClass(classId: number) {
        const cls = await this.classRepository.findOneBy({ id: classId, deletedAt: IsNull() });
        if (cls) {
            await this.classRepository.softRemove(cls);
            return true;
        }
        return false;
    }
}