import AppError from "../../errorHelpers/appError";
import type { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credintialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isExist = await User.findOne({ email }).select("+password");

  console.log("isExist:", isExist);

  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isExist.password as string
  );

  console.log("isPasswordMatched:", isPasswordMatched);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password does not match");
  }

  const { password: existedUserPassword, ...others } = isExist;

  const jwtPayload = {
    email: isExist.email,
    role: isExist.role,
    userId: isExist._id,
  };
  // const accessToken = jwt.sign(jwtPayload, "your_jwt_secret_key", {
  //   expiresIn: "1d",
  // });

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  const { password: pass, ...rest } = isExist.toObject();

  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

export const AuthServices = {
  credintialsLogin,
};
