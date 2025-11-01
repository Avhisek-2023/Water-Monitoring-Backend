import { Request, Response } from "express";
import { IUser } from "../interfaces/IUser.js";
import { ResponseApi } from "../GlobalResponse/Response.js";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/jwtService.js";
import mongoose from "mongoose";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role }: IUser = req.body;
    if (password.length < 8) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "Password must be at least 8 characters"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "User already exists"));
    }

    if (existingUser && !existingUser.isVerified) {
      await User.deleteOne({ email });
    }

    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      role: role || "user",
      otp: "",
      otpExpiry: new Date(),
    });

    await newUser.save();

    const token: string = generateAccessToken(
      newUser._id as mongoose.Types.ObjectId
    );
    return res.status(201).json(
      ResponseApi.success(201, "Account created successfully", {
        accessToken: token,
      })
    );
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json(ResponseApi.error(500, "Internal server error", error as string));
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const data: IUser[] = await User.find().select(
    "-password -otp -otpExpiry -__v"
  );
  return res
    .status(200)
    .json(ResponseApi.success(200, "Users fetched successfully", data));
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password -otp -otpExpiry -__v");
  if (!user) {
    return res.status(404).json(ResponseApi.error(404, "User not found"));
  }
  return res
    .status(200)
    .json(ResponseApi.success(200, "User fetched successfully", user));
};

export const getUserProfile = async (req: Request, res: Response) => {
  console.log(req.user?.userID);
  const user = await User.findById(req.user?.userID).select(
    "-password -otp -otpExpiry -isVerified -__v"
  );
  if (!user) {
    return res.status(404).json(ResponseApi.error(404, "User not found"));
  }

  return res
    .status(200)
    .json(ResponseApi.success(200, "User profile fetched successfully", user));
};
