import { IsNull, In } from "typeorm";
import { AppDataSource } from "../config/ormconfig";
import Subject from "../entity/subject";
import TeacherDetails from "../entity/teachersDetails";

export default class SubjectService {
    private subjectRepository = AppDataSource.getRepository(Subject);
    private teacherDetailsRepository = AppDataSource.getRepository(TeacherDetails);

    // Create a single subject
    async createSubject(name: string) {
        const subject = new Subject();
        subject.name = name;
        return await this.subjectRepository.save(subject);
    }

    // Create multiple subjects
    async createSubjects(names: string[]) {
        const subjects = names.map(name => {
            const subject = new Subject();
            subject.name = name;
            return subject;
        });
        return await this.subjectRepository.save(subjects);
    }

    // Assign teachers to a subject
    async assignTeachers(subjectId: number, teacherDetailsIds: number[]) {
        const subject = await this.subjectRepository.findOne({
            where: { id: subjectId, deletedAt: IsNull() },
            relations: ["teachers"]
        });

        if (subject) {
            const teacherDetails = await this.teacherDetailsRepository.findBy({ id: In(teacherDetailsIds), deletedAt: IsNull() });
            subject.teachers = teacherDetails;
            return await this.subjectRepository.save(subject);
        }
        return null;
    }

    // Soft delete a subject
    async deleteSubject(subjectId: number) {
        const subject = await this.subjectRepository.findOneBy({ id: subjectId, deletedAt: IsNull() });
        if (subject) {
            await this.subjectRepository.softRemove(subject);
            return true;
        }
        return false;
    }
}