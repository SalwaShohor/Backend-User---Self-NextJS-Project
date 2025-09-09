import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// function toBase64url(input) {
//   if (!input) return null;
//   if (Buffer.isBuffer(input)) return input.toString("base64url");
//   try {
//     return Buffer.from(input, "base64").toString("base64url");
//   } catch {
//     return input; // assume already base64url
//   }
// }

// Utility function to convert Buffer to Base64URL string
function toBase64url(buffer) {
  return buffer.toString("base64url");
}

// export async function addCredential(
//   userId,
//   credentialID,
//   publicKey,
//   counter = 0
// ) {
//   return await prisma.credentials.create({
//     data: {
//       credentialID: toBase64url(credentialID),
//       publicKey: toBase64url(publicKey),
//       counter,
//       user_id: userId,
//     },
//   });
// }

// Save new credential after registration
// Save new credential after registration
export async function addCredential(
  userId,
  credentialID,
  publicKey, // Buffer
  counter = 0
) {
  return await prisma.credentials.create({
    data: {
      credentialID,
      // publicKey: toBase64url(publicKey), // 🐛 Fix is here!
      publicKey,
      counter,
      user_id: userId,
    },
  });
}

// Find credential for login verification
export async function findCredentialByCredentialID(credentialID) {
  return await prisma.credentials.findUnique({
    where: {
      credentialID, // ✅ no conversion, it’s already base64url from client
    },
  });
}

// Update signature counter
export async function updateCredentialCounter(credentialID, newCounter) {
  return await prisma.credentials.update({
    where: {
      credentialID, // ✅ no conversion
    },
    data: { counter: newCounter },
  });
}

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // Example: add credential to a user
// export async function addCredential(
//   userId,
//   credentialID,
//   publicKey,
//   counter = 0
// ) {
//   return await prisma.credentials.create({
//     data: {
//       credentialID,
//       publicKey,
//       counter,
//       user_id: userId, // match your schema field name
//     },
//   });
// }
