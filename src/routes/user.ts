import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserProfile,
} from "../controllers/users.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

//COMMON ROUTES
router.get("/profile", verifyToken, getUserProfile);

//ADMIN ROUTES
router.post("/create", verifyToken, authorizeRoles("admin"), createUser);
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);
router.get("/:id", verifyToken, authorizeRoles("admin"), getUserById);

export default router;
