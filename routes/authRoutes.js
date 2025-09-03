import express from "express";
import {
  registerOptions,
  registerVerify,
  loginOptions,
  loginVerify,
  handleGetAllUsers,
  updateUserController,
} from "../controllers/authController.js";
// import { findUserByEmail, getAllUsers, } from "../models/users.js";

const router = express.Router();

router.post("/register-options", registerOptions);
router.post("/register-verify", registerVerify);
router.get("/login-options", loginOptions);
router.post("/login-verify", loginVerify);
router.get("/all-users", handleGetAllUsers);
// PUT /users/:id
router.put("/users/:id", updateUserController);

export default router;
