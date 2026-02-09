import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

//middleware
app.use(cors());
app.use(express.json());

//health check
app.get("/health", (_req,res) => {
    res.status(200).json({status: "OK", message: "GYM API is running"});
});

export default app;