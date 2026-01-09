import AppError from "../../errorHelpers/appError";
import type { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
const credintialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  console.log("Auth service called" , payload);

  const isExist = await User.findOne({ email });

  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password does not match");
  }

  const { password: existedUserPassword, ...others } = isExist;

  return {
    ...others,
  };
};

export const AuthServices = {
  credintialsLogin,
};
