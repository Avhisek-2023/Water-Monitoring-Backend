import express from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../../controllers/Auth/auth.js";
import oauthRoutes from "./OAuth/oauth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.use("/oauth", oauthRoutes);

export default router;
