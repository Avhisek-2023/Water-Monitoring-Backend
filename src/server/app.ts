import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Water Quality Monitoring API" });
});

app.use("/api/auth", authRoutes);
export default app;
