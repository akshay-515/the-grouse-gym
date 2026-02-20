import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import memberRoutes from "./routes/member.routes";
import paymentRoutes from "./routes/payment.routes";

dotenv.config();

const app: Application = express();

//middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes)
app.use("/api/payments", paymentRoutes)

//health check
app.get("/health", (_req,res) => {
    res.status(200).json({status: "OK", message: "GYM API is running"});
});

export default app;