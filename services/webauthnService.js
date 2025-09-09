// services/webauthnService.js
import crypto from "crypto";
import {
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

import { updateUser, updateUserChallenge } from "../models/users.js";
import { addCredential } from "../models/credential.js";
import { fromBase64url } from "../utils/base64.js";

const prisma = new PrismaClient();

const rpName = "Next App";
// const rpID = "localhost"; // relying party ID must match domain
// const origin = `http://${rpID}:3000`;

const rpID = process.env.WEBAUTHN_RPID;
const origin = process.env.WEBAUTHN_ORIGIN;

// A helper function to convert Buffer to Base64URL string
const toBase64url = (buf) => {
    return buf.toString("base64url");
};
// const toBase64url = (buf) => {
//   return buf
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=/g, "");
// };

/**
 * Generate Registration Options
 */
export async function generateAndStoreRegisterOptions(user) {
  const challenge = crypto.randomBytes(32);
  const challengeStr = toBase64url(challenge);

  await updateUserChallenge(user.email, challengeStr);

  return {
    challenge: challengeStr,
    rp: { id: rpID, name: rpName },
    user: {
      id: toBase64url(Buffer.from(user.id.toString())),
      name: user.email,
      displayName: user.full_name,
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" }, // ES256
      { alg: -257, type: "public-key" }, // RS256
    ],
    timeout: 60000,
    attestation: "none", // simpler + better cross-device support
    authenticatorSelection: {
      residentKey: "preferred",
      requireResidentKey: false,
      userVerification: "preferred",
    },
  };
}


/**
 * Verify Registration Response
 */
export async function verifyRegisterResponse(user, attestationResponse) {
  const expectedChallenge = user.currentChallenge;
  if (!expectedChallenge) {
    throw new Error("No challenge found for this registration");
  }

  const verification = await verifyRegistrationResponse({
    response: attestationResponse,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  console.log("WebAuthn Verification Result:", verification);

  if (!verification.verified) {
    throw new Error("Registration verification failed");
  }

  const { credential } = verification.registrationInfo;
  const { id, publicKey, counter } = credential;

  // Store as Base64URL — ensure addCredential signature matches (userId, credentialID, publicKey, counter)
  await addCredential(
    user.id,
    id, // already base64url string from @simplewebauthn
    toBase64url(publicKey), // convert Buffer -> base64url
    // publicKey,
    counter
  );

  await updateUserChallenge(user.email, null);

  return true;
}



/**
 * Generate Authentication Options (Login)
 */
export async function generateAndStoreLoginOptions(user) {
  const challenge = crypto.randomBytes(32);
  const challengeStr = toBase64url(challenge);

  await updateUserChallenge(user.email, challengeStr);

  return {
    challenge: challengeStr,
    allowCredentials: user.credentials.map((c) => ({
      id: c.credentialID, // already stored as base64url → don’t re-encode
      type: "public-key",
    })),
    timeout: 60000,
    rpId: rpID,
    userVerification: "preferred",
  };
}

/**
 * Verify Authentication Response (Login)
 */
// export async function verifyLoginResponse(user, loginResp) {
//   const expectedChallenge = user.currentChallenge;
//   if (!expectedChallenge) {
//     throw new Error("A challenge was not found. Please try logging in again.");
//   }

//   // Match credential by Base64URL string ID
//   const dbCred = user.credentials.find((c) => c.credentialID === loginResp.id);

//   if (!dbCred) {
//     console.error("❌ No matching credential found.");
//     console.error("Client sent:", loginResp.id);
//     console.error(
//       "Stored:",
//       user.credentials.map((c) => c.credentialID)
//     );
//     throw new Error("Authenticator not registered");
//   }

//   try {
//     const verification = await verifyAuthenticationResponse({
//       response: loginResp,
//       expectedChallenge,
//       expectedOrigin: origin,
//       expectedRPID: rpID,
//       authenticator: {
//         // decode Base64URL back into buffers using your helper
//         credentialID: fromBase64url(dbCred.credentialID),
//         credentialPublicKey: fromBase64url(dbCred.publicKey),
//         counter: dbCred.counter ?? 0,
//       },
//     });

//     if (verification.verified) {
//       await prisma.credentials.update({
//         where: { id: dbCred.id },
//         data: { counter: verification.authenticationInfo.newCounter },
//       });
//       await updateUserChallenge(user.email, null);
//     } else {
//       console.warn("Authentication verification returned verified=false", verification);
//     }

//     return verification.verified;
//   } catch (err) {
//     // Log the exact error (very helpful for debugging signature/format issues)
//     console.error("Error during verifyAuthenticationResponse:", err);
//     throw new Error("Failed to verify login");
//   }
// }
export async function verifyLoginResponse(user, loginResp) {
  const expectedChallenge = user.currentChallenge;
  if (!expectedChallenge) {
    throw new Error("A challenge was not found. Please try logging in again.");
  }

  // 🔎 Find matching credential by ID
  const dbCred = user.credentials.find((c) => c.credentialID === loginResp.id);

  if (!dbCred) {
    console.error("❌ No matching credential found.");
    console.error("Client sent:", loginResp.id);
    console.error("Stored:", user.credentials.map((c) => c.credentialID));
    throw new Error("Authenticator not registered");
  }

  // ✅ Verify authentication response
  const verification = await verifyAuthenticationResponse({
    response: loginResp,
    expectedChallenge,
    expectedOrigin: process.env.WEBAUTHN_ORIGIN,
    expectedRPID: process.env.WEBAUTHN_RPID,
    authenticator: {
      credentialID: fromBase64url(dbCred.credentialID),
      credentialPublicKey: fromBase64url(dbCred.publicKey),
      counter: dbCred.counter ?? 0,
    },
  });

  if (verification.verified) {
    await updateCredentialCounter(
      dbCred.credentialID,
      verification.authenticationInfo.newCounter,
    );
    await updateUserChallenge(user.email, null);
  }

  return verification.verified;
}