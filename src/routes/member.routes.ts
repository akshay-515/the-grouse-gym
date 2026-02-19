import { authenticate } from "../middlewares/auth.middleware";
import router from "./auth.routes";

router.use(authenticate);

router.post("/", createMember);
router.get("/", getMembers);
