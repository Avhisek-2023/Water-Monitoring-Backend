import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL as string;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

export default app;
