import { Router } from "express";
import { getMemberships } from "../controllers/memberships.controller";

const router = Router();

router.get("/" , getMemberships);

export default router;