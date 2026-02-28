import bcrypt from "bcrypt";
import { prisma } from "../database/prisma.js";

export const createAdminService = async (
  username: string,
  email: string,
  password: string,
) => {
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return admin;
};

export const loginAdminService = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return admin;
};
