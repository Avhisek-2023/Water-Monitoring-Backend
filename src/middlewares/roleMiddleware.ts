import { NextFunction, Request, Response } from "express";
import User from "../models/users.js";
import { ResponseApi } from "../GlobalResponse/Response.js";
import { log } from "console";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userID;
      // console.log("Role Middleware id", userId);

      if (!userId) {
        return res.status(401).json(ResponseApi.error(401, "Unauthorized"));
      }

      const user = await User.findById(userId);

      // console.log("Role Middleware user", user);

      if (!user) {
        return res.status(404).json(ResponseApi.error(404, "User Not Found"));
      }

      console.log("Role Middleware role", user.role);
      console.log("Role Middleware allowedRoles", allowedRoles);
      if (!allowedRoles.includes(user.role)) {
        console.log("Access Denied");
        return res.status(403).json(ResponseApi.error(403, "Access Denied"));
      }
      next();
    } catch (error) {
      console.error("Role Middleware error", error);
      return res
        .status(500)
        .json(ResponseApi.error(500, "Internal Server Error"));
    }
  };
};
