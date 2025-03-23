// ormconfig.ts
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "testdb",
    synchronize: true, // Automatically create tables based on entities
    logging: false, // Log SQL queries
    entities: [
        "src/entity/**/*.ts" // Path to your entities
    ],
    migrations: [
        "src/migration/**/*.ts"
    ],
    subscribers: [
        "src/subscriber/**/*.ts"
    ],
});

// Test TypeORM database connection
async function testConnection() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connection successful!");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
}

// Export the DataSource and testConnection function
export { AppDataSource, testConnection };