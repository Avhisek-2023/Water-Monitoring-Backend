import exprees from "express";
import { login, register, verifyOtp } from "../controllers/auth.ts";
const router = exprees.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
export default router;
