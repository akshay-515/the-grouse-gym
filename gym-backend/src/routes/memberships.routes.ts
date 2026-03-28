import { Router } from "express";
import { getMemberships } from "../controllers/memberships.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/" , getMemberships);

export default router;