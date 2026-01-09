import AppError from "../../errorHelpers/appError";
import type { AuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
const createUser = async (payload: Partial<IUser>) => {
  const { email,password, ...rest } = payload;

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const authProvider : AuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email: email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();

  return {
    data: users,
    meta: {
      total: users.length,
    },
  };
};

export const userServices = {
  createUser,
  getAllUsers,
};
