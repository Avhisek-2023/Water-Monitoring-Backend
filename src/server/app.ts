import express from "express";
import cors from "cors";
import authRoutes from "../routes/Auth/auth.js";
import userRoutes from "../routes/user.js";

import contactRoutes from "../routes/contact.js";
import addressRoutes from "../routes/address.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Water Quality Monitoring API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/address", addressRoutes);
export default app;
