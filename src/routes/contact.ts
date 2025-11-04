import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { saveContact } from "../controllers/contact.js";

const router = express.Router();

// CONTACT ROUTES
router.post("/save", verifyToken, saveContact);

export default router;
