import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Utility function to convert Buffer to Base64URL string
function toBase64url(buffer) {
  return buffer.toString("base64url");
}

// Save new credential after registration
export async function addCredential(
  userId,
  credentialID,
  public_key, // Buffer
  counter = 0
) {
  return await prisma.credentials.create({
    data: {
      credentialID,
      public_key,
      counter,
      user_id: userId,
    },
  });
}

// Find credential for login verification
export async function findCredentialByCredentialID(credentialID) {
  return await prisma.credentials.findUnique({
    where: {
      credentialID,
    },
  });
}

// Update signature counter
export async function updateCredentialCounter(credentialID, newCounter) {
  return await prisma.credentials.update({
    where: {
      credentialID,
    },
    data: { counter: newCounter },
  });
}
