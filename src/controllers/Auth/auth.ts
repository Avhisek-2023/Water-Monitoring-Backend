import { Request, Response } from "express";
import User from "../../models/users.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../../utils/jwtService.js";
import mongoose from "mongoose";
import { IUser } from "../../interfaces/IUser.js";
import { generateOtp } from "../../utils/otpService.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ResponseApi } from "../../GlobalResponse/Response.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: IUser = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "Invalid credentials"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "Invalid credentials"));
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "Please verify your account"));
    }
    const token: string = generateAccessToken(
      user._id as mongoose.Types.ObjectId
    );

    res.json(
      ResponseApi.success(200, "Login successful", { accessToken: token })
    );
  } catch (error) {
    res
      .status(500)
      .json(ResponseApi.error(500, "Internal server error", error as string));
  }
};
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: IUser = req.body;
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

    const otp: string = generateOtp();
    const otpExpiry: Date = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry,
    });

    await newUser.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account - OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return res
      .status(201)
      .json(
        ResponseApi.success(
          201,
          "User registered successfully. Please verify your email."
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(ResponseApi.error(500, "Internal server error", error as string));
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "Invalid email or OTP"));
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "User already verified"));
    }
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "Invalid email or OTP"));
    }
    user.isVerified = true;
    user.otp = "";
    user.otpExpiry = new Date();
    await user.save();
    const token: string = generateAccessToken(
      user._id as mongoose.Types.ObjectId
    );
    res.status(201).json(
      ResponseApi.success(201, "Account verified successfully", {
        accessToken: token,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(ResponseApi.error(500, "Internal server error", error as string));
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(ResponseApi.error(404, "User not found"));
    }

    const otp: string = generateOtp();
    const otpExpiry: Date = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.isVerified = false;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account - OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return res
      .status(201)
      .json(
        ResponseApi.success(
          201,
          "User registered successfully. Please verify your email."
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(ResponseApi.error(500, "Internal server error", error as string));
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(ResponseApi.error(404, "User not found"));
    }
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.otp = "";
    user.otpExpiry = new Date();
    await user.save();
    return res
      .status(200)
      .json(ResponseApi.success(200, "Password reset successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(ResponseApi.error(500, "Internal server error", error as string));
  }
};
