import { Request, Response } from "express";
import ClassService from "../services/classService";

export default class ClassController {
    private classService = new ClassService();

    // Create a single class
    createClass = async (req: Request, res: Response) => {
        const { name, headTeacherId, assistantTeacherId } = req.body;
        const cls = await this.classService.createClass(name, headTeacherId, assistantTeacherId);
        res.status(201).json(cls);
    }

    // Create multiple classes
    createClasses = async (req: Request, res: Response) => {
        const classData = req.body;
        const classes = await this.classService.createClasses(classData);
        res.status(201).json(classes);
    }

    // Assign subjects to a class
    assignSubjects = async (req: Request, res: Response) => {
        const { classId } = req.params;
        const { subjectIds } = req.body;
        const cls = await this.classService.assignSubjects(Number(classId), subjectIds);
        res.status(200).json(cls);
    }

    // Assign students to a class
    assignStudents = async (req: Request, res: Response) => {
        const { classId } = req.params;
        const { studentIds } = req.body;
        const cls = await this.classService.assignStudents(Number(classId), studentIds);
        res.status(200).json(cls);
    }

    // Update teachers in a class
    updateClassTeachers = async (req: Request, res: Response) => {
        const { classId } = req.params;
        const { headTeacherId, assistantTeacherId } = req.body;
        const cls = await this.classService.updateClassTeachers(Number(classId), headTeacherId, assistantTeacherId);
        res.status(200).json(cls);
    }

    // Get class details
    getClassDetails = async (req: Request, res: Response) => {
        const { classId } = req.params;
        const cls = await this.classService.getClassDetails(Number(classId));
        res.status(200).json(cls);
    }

    // Soft delete a class
    deleteClass = async (req: Request, res: Response) => {
        const { classId } = req.params;
        const result = await this.classService.deleteClass(Number(classId));
        res.status(200).json({ success: result });
    }
}