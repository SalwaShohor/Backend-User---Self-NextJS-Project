// controllers/authController.js
import {
  // getRegisterOptions,
  verifyRegisterResponse,
  generateAndStoreLoginOptions,
  verifyLoginResponse,
  generateAndStoreRegisterOptions,
} from "../services/webauthnService.js";
import { generateJWT } from "../utils/jwt.js";
import {
  findUserByEmail,
  createUser,
  updateUser,
  findUserById,
  getAllUsers,
  updateUserChallenge,
} from "../models/users.js";
import { addCredential } from "../models/credential.js";
// import { updateUser } from "../services/userService.js";

function handleControllerError(res, err) {
  console.error("Controller error:", err);
  const msg = err?.message || "Internal Server Error";
  res.status(500).json({ error: msg });
}

// Handles WebAuthn registration options and hashes the password
export async function registerOptions(req, res) {
  try {
    const { full_name, email, role, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // 1. Create a new user with the password
    const user = await createUser({ full_name, email, password, role });

    // 2. Generate and store the WebAuthn challenge
    const options = await generateAndStoreRegisterOptions(user);

    // 3. Respond with the options for the client
    return res.json(options);
  } catch (err) {
    console.error("registerOptions error:", err);
    const statusCode = err.message.includes("registered") ? 409 : 500;
    return res
      .status(statusCode)
      .json({ error: err.message || "Internal Server Error" });
  }
}

export async function registerVerify(req, res) {
  try {
    const { email, ...attestationResponse } = req.body;

    if (!email || !attestationResponse) {
      return res
        .status(400)
        .json({ error: "Email and attestation response are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ➡️ Call your custom verification service function here
    await verifyRegisterResponse(user, attestationResponse);

    return res.json({ success: true, verified: true });
  } catch (err) {
    console.error("Register verify error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Handles WebAuthn login options

export async function loginOptions(req, res) {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.credentials?.length) {
      return res.status(400).json({ error: "No credentials registered" });
    }

    const options = await generateAndStoreLoginOptions(user);
    return res.json(options);
  } catch (err) {
    console.error("loginOptions error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
}

export async function loginVerify(req, res) {
  try {
    const { email, credential } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!credential)
      return res
        .status(400)
        .json({ error: "Authentication response is required" });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const expectedChallenge = user.currentChallenge;
    if (!expectedChallenge) {
      return res
        .status(400)
        .json({ error: "No challenge found. Please login again." });
    }

    const verified = await verifyLoginResponse(user, credential);

    if (verified) {
      const token = generateJWT(user);
      const { password, currentChallenge, credentials, ...safeUser } = user;
      return res.json({ verified: true, token, user: safeUser });
    }

    return res
      .status(401)
      .json({ verified: false, error: "Authentication failed" });
  } catch (err) {
    console.error("Login verify error:", err.message);
    return res
      .status(401)
      .json({ error: err.message || "Authentication failed" });
  }
}

export async function handleGetAllUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const { full_name, password, role, currentChallenge } = req.body;

    const updatedUser = await updateUser(parseInt(id), {
      // ...(full_name && { full_name }),
      // ...(password && { password }), // hash later
      // ...(role && { role }),
      ...(currentChallenge && { currentChallenge }),
    });

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
