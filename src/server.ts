import app from "./app";
import config from "./config";
import { db } from "./db";

const startServer = async () => {
    try{
        await db.query("SELECT 1");
        console.log("Database connection verified");

        app.listen(config.port, () => {
            console.log(`server running on port ${config.port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();