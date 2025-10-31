import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserProfile,
} from "../controllers/users.ts";
import { verifyToken } from "../middlewares/authMiddleware.ts";
import { authorizeRoles } from "../middlewares/roleMiddleware.ts";

const router = express.Router();

//COMMON ROUTES
router.get("/profile", verifyToken, getUserProfile);

//ADMIN ROUTES
router.post("/create", verifyToken, authorizeRoles("admin"), createUser);
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);
router.get("/:id", verifyToken, authorizeRoles("admin"), getUserById);

export default router;
