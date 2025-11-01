import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { ResponseApi } from "../../GlobalResponse/Response.js";
import User from "../../models/users.js";
import { generateAccessToken } from "../../utils/jwtService.js";
import mongoose from "mongoose";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const googleVerification = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payLoad = googleVerification.getPayload();

    if (!payLoad?.email) {
      return res
        .status(400)
        .json(ResponseApi.error(400, "Google login failed: No email found"));
    }

    const existingUser = await User.findOne({ email: payLoad.email });

    if (existingUser) {
      const accessToken = generateAccessToken(
        existingUser._id as mongoose.Types.ObjectId
      );
      return res
        .status(200)
        .json(ResponseApi.success(200, "Login Successful", { accessToken }));
    }

    const user = new User({
      name: payLoad?.name,
      email: payLoad?.email,
      isVerified: true,
    });

    await user.save();

    const accessToken = generateAccessToken(
      user._id as mongoose.Types.ObjectId
    );
    return res
      .status(200)
      .json(ResponseApi.success(200, "Login Successful", { accessToken }));
  } catch (error) {
    return res
      .status(500)
      .json(ResponseApi.error(500, "Internal Server Error"));
  }
};
