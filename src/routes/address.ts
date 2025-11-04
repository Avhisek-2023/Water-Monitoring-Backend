import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { saveAddress } from "../controllers/address.js";

const router = express.Router();

// ADDRESS ROUTES
router.post("/save", verifyToken, saveAddress);

export default router;
