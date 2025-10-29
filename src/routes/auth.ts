import exprees from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyOtp,
} from "../controllers/auth.ts";
const router = exprees.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
