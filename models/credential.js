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

export async function addCredential(
  userId,
  credentialID, // this is already a Buffer from verifyRegisterResponse
  publicKey,
  counter = 0
) {
  return await prisma.credentials.create({
    data: {
      // ✅ CORRECTED: Use toBase64url() to save in the correct format
      credentialID: toBase64url(credentialID),
      publicKey: toBase64url(publicKey),
      counter,
      user_id: userId,
    },
  });
}

export async function findCredentialByCredentialID(credentialID) {
  return await prisma.credentials.findUnique({
    where: { credentialID: toBase64url(credentialID) },
  });
}

export async function updateCredentialCounter(credentialID, newCounter) {
  return await prisma.credentials.update({
    where: { credentialID: toBase64url(credentialID) },
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
