import express from "express";
import { googleLogin } from "../../../controllers/Auth/oauth.js";

const router = express.Router();

router.post("/google-login", googleLogin);
export default router;
