import { authenticate } from "../middlewares/auth.middleware";
import { createMember, getMembers, getMemberById, deleteMember, updateMembers } from "../controllers/member.controller";
import { Router } from "express";

const router = Router();

// router.use(authenticate);

router.post("/", createMember);
router.get("/", getMembers);
router.get("/:id", getMemberById);
router.put("/:id", updateMembers);
router.delete("/:id", deleteMember);

export default router;

