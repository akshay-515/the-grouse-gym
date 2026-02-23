import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createPayment } from "../controllers/payment.controller";

const router = Router();

router.use(authenticate);
router.post("/", createPayment);

export default router;