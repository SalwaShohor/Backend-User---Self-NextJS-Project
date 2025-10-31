import express from "express";
import {
  registerOptions,
  registerVerify,
  loginOptions,
  loginVerify,
  handleGetAllUsers,
  updateUserController,
  getUserProfile,
  prelogin,
  logout,
} from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
// import { findUserByEmail, getAllUsers, } from "../models/users.js";

const router = express.Router();

router.post("/register-options", registerOptions);
router.post("/register-verify", registerVerify);
router.post("/prelogin", prelogin);
router.get("/login-options", loginOptions);
router.post("/login-verify", loginVerify);
router.post("/logout", logout);
router.get("/all-users", handleGetAllUsers);
// PUT /users/:id
router.put("/users/:id", updateUserController);

router.get("/users/profile", authenticateJWT, getUserProfile);

export default router;
