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

//middleware
app.use(cors({
  origin: function (origin, callback) {

    console.log("CORS Origin:", origin);
    if (!origin) return callback(null, true);

    if (
      origin === "http://localhost:5173" ||
      origin === "http://localhost:3000"
    ) {
      return callback(null, true);
    }

    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/memberships", membershipsRoutes);

export default app;