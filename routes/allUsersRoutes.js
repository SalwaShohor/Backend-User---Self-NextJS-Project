import express from "express";
import { handleGetAllUsers } from "../controllers/authController.js";
// import { findUserByEmail, getAllUsers, } from "../models/users.js";

const router = express.Router();

router.get("/all-users", handleGetAllUsers);

export default router;
