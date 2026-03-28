import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import memberRoutes from "./routes/member.routes";
import paymentRoutes from "./routes/payment.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import membershipsRoutes from "./routes/memberships.routes";

dotenv.config();

const app: Application = express();

const allowedorigins = [
  'http://localhost:5173', // Local development
  'https://the-grouse-gym-git-dev-main-akshay-515s-projects.vercel.app', // Vercel URL
  'https://the-grouse-gym.vercel.app' // Any other custom domain
];

//middleware
app.use(cors({
    origin: allowedorigins,
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/memberships", membershipsRoutes);

//health check
app.get("/health", (_req,res) => {
    res.status(200).json({status: "OK", message: "GYM API is running"});
});

export default app;