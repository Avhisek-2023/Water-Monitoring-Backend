import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/users.ts";
import { ResponseApi } from "../GlobalResponse/Response.ts";

interface DecodedUser extends JwtPayload {
  userID: string;
  role?: string;
}
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let authHead =
    req.headers.Authorization?.toString() ||
    req.headers.authorization?.toString() ||
    "";

  if (!authHead || !authHead.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(ResponseApi.error(401, "Unauthorized: No token provided"));
  }
  const token = authHead.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!token) {
    return res
      .status(401)
      .json(ResponseApi.error(401, "Unauthorized: No token provided"));
  }
  try {
    const decoded = jwt.verify(token, jwtSecret || "") as DecodedUser;
    req.user = decoded;
    // console.log(req.user);
    next();
  } catch (error) {
    return res
      .status(401)
      .json(ResponseApi.error(401, "Unauthorized: Invalid token"));
  }
};
