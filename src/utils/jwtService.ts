import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const generateAccessToken = (userID: mongoose.Types.ObjectId) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  return token;
};
