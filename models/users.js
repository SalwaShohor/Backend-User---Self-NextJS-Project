import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ✅ Find user by email
// ✅ Find user by email and include credentials relation
export async function findUserByEmail(email) {
  return await prisma.users.findUnique({
    where: { email },
    include: { credentials: true }, // IMPORTANT — ensures user.credentials exists
  });
}

// ✅ Create a new user
// ✅ Create a new user with hashed password + duplicate check
export async function createUser({
  full_name,
  email,
  password,
  role = "user",
}) {
  // Check for existing user
  const existing = await prisma.users.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email already registered");
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.users.create({
    data: {
      full_name,
      email,
      password: hashedPassword,
      role,
    },
  });
}

// ✅ Update user (e.g., update name or password)
export async function updateUser(id, data) {
  return await prisma.users.update({
    where: { id },
    data,
  });
}

// ✅ Update only currentChallenge for a given user
export async function updateUserChallenge(email, challenge) {
  // Fix: Use the email as the unique identifier for the update
  if (!email) {
    throw new Error("Email is required to update user challenge.");
  }
  const updatedUser = await prisma.users.update({
    where: { email },
    data: { currentChallenge: challenge },
  });
  console.log("✅ Challenge saved to DB:", updatedUser.currentChallenge);
  return updatedUser;
}

// ✅ Get user by ID
export async function findUserById(id) {
  return await prisma.users.findUnique({
    where: { id },
    include: { credentials: true },
  });
}

// ✅ Get all users
export async function getAllUsers() {
  return await prisma.users.findMany({
    orderBy: { created_at: "desc" },
  });
}

// // ✅ Find user by email
// // ✅ Find user by email and include credentials relation
// export async function findUserByEmail(email) {
//   return await prisma.users.findUnique({
//     where: { email },
//     include: { credentials: true }, // IMPORTANT — ensures user.credentials exists
//   });
// }

// // ✅ Create a new user
// // ✅ Create a new user with hashed password + duplicate check
// export async function createUser({
//   full_name,
//   email,
//   password,
//   role = "user",
// }) {
//   // Check for existing user
//   const existing = await prisma.users.findUnique({
//     where: { email },
//   });

//   if (existing) {
//     throw new Error("Email already registered");
//   }

//   // Hash password before saving
//   const hashedPassword = await bcrypt.hash(password, 10);

//   return await prisma.users.create({
//     data: {
//       full_name,
//       email,
//       password: hashedPassword,
//       role,
//     },
//   });
// }

// // ✅ Update user (e.g., update name or password)
// export async function updateUser(id, data) {
//   return await prisma.users.update({
//     where: { id },
//     data,
//   });
// }

// // ✅ Update only currentChallenge for a given user
// // export async function updateUserChallenge(id, challenge) {
// //   const updatedUser = await prisma.users.update({
// //     where: { id },
// //     data: { currentChallenge: challenge },
// //   });
// //   console.log("✅ Challenge saved to DB:", updatedUser.currentChallenge);
// //   return updatedUser;
// // }

// export async function updateUserChallenge(userId, challenge) {
//   // Now 'prisma' is correctly defined and available
//   const updatedUser = await prisma.user.update({
//     where: { id: userId },
//     data: { currentChallenge: challenge },
//   });
//   return updatedUser;
// }

// // ✅ Get user by ID
// export async function findUserById(id) {
//   return await prisma.users.findUnique({
//     where: { id },
//     include: { credentials: true },
//   });
// }

// // ✅ Get all users
// export async function getAllUsers() {
//   return await prisma.users.findMany({
//     orderBy: { created_at: "desc" },
//   });
// }

// // export async function createUser({
// //   full_name,
// //   email,
// //   password,
// //   role = "user",
// // }) {
// //   return await prisma.users.create({
// //     data: {
// //       full_name,
// //       email,
// //       password, // make sure it's hashed before storing!
// //       role,
// //     },
// //   });
// // }
