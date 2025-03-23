import { Request, Response } from "express";
import SubjectService from "../services/subjectService";

export default class SubjectController {
    private subjectService = new SubjectService();

    // Create a single subject
    createSubject = async (req: Request, res: Response) => {
        const { name } = req.body;
        const subject = await this.subjectService.createSubject(name);
        res.status(201).json(subject);
    }

    // Create multiple subjects
    createSubjects = async (req: Request, res: Response) => {
        const { names } = req.body;
        const subjects = await this.subjectService.createSubjects(names);
        res.status(201).json(subjects);
    }

    // Assign teachers to a subject
    assignTeachers = async (req: Request, res: Response) => {
        const { subjectId } = req.params;
        const { teacherDetailsIds } = req.body;
        const subject = await this.subjectService.assignTeachers(Number(subjectId), teacherDetailsIds);
        res.status(200).json(subject);
    }

    // Soft delete a subject
    deleteSubject = async (req: Request, res: Response) => {
        const { subjectId } = req.params;
        const result = await this.subjectService.deleteSubject(Number(subjectId));
        res.status(200).json({ success: result });
    }
}