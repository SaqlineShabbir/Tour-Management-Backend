import AppError from "../../errorHelpers/appError";
import {
  IsActive,
  Role,
  type AuthProvider,
  type IUser,
} from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import type { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const authProvider: AuthProvider = {
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

const updateUser = async (
  id: any,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isExist = await User.findById(id);

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  

  if (payload.role) {
    if (
      decodedToken.role === Role.USER ||
      decodedToken.role === Role.GUIDE
    ) {
      console.log('is exist from update forbidden' )
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
      
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }
  if (payload.isActive || payload.isDeleted || payload.isVarified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUNDS)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
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
  updateUser,
};
