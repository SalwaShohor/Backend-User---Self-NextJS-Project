import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import allUsersRoutes from "./routes/allUsersRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true }));

// All routes for auth
app.use("/auth", authRoutes); //login-options
// app.use("/auth/register-options", authRoutes);
// app.use("/auth/register-verify", authRoutes);
// app.use("/auth/login-verify", authRoutes);
// app.use("/auth", authRoutes);
// app.use("/auth/login-options", authRoutes);

// Simple DB connection test route
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // test query
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

// Start backend service
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend User Service running on port ${PORT}`);
});
