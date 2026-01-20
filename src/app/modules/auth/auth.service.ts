import AppError from "../../errorHelpers/appError";
import { IsActive, type IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userToken";

const credintialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isExist = await User.findOne({ email }).select("+password");

  console.log("isExist:", isExist);

  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isExist.password as string,
  );

  console.log("isPasswordMatched:", isPasswordMatched);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password does not match");
  }

  const { password: existedUserPassword, ...others } = isExist;

  const userTokens = createUserTokens(isExist);

  const { password: pass, ...rest } = isExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};
const getNewAccessTokenService = async (refreshToken: string) => {
   const getNewAccessToken =await createNewAccessTokenWithRefreshToken(refreshToken)

  return {
    accessToken:getNewAccessToken
  };
};

export const AuthServices = {
  credintialsLogin,
  getNewAccessTokenService,
};
