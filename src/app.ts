// app.ts
import express from "express";
import { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/ormconfig";
import { tutorialRoutes } from "./routes/tutorialRoutes";
import "reflect-metadata";
import { authRoutes } from "./routes/authRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { teacherRoutes } from "./routes/teacherRoutes";
import { studentRoutes } from "./routes/studentRoutes";
import { classRoutes } from "./routes/classRoutes";
import { subjectRoutes } from "./routes/subjectRoutes";

const app: Application = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.get("/", (req, res) => {
    res.send("<h1>Welcome To JWT Authentication</h1>");
});
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/tutorial", tutorialRoutes)
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/teachers", teacherRoutes); // Teacher routes
app.use("/api/v1/students", studentRoutes); // Student routes
app.use("/api/v1/classes", classRoutes)
app.use("/api/v1/subjects", subjectRoutes)

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    // Test the database connection
    testConnection();
});