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
  credentialID, // already Base64URL string from verifyRegisterResponse
  publicKey,    // Buffer
  counter = 0
) {
  return await prisma.credentials.create({
    data: {
      credentialID,                 // store as-is, already base64url
      publicKey: toBase64url(publicKey), // convert Buffer → base64url
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
