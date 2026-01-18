import type { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, type IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/appError";
import httpStatus from "http-status-codes";
export const createUserTokens = (user: Partial<IUser>) =>{

      const jwtPayload = {
    email: user.email,
    role: user.role,
    userId: user._id,
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

  return {
    accessToken,
    refreshToken
  }
}

export const createNewAccessTokenWithRefreshToken = async(refreshToken:string) =>{
const verifyRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  const isExist = await User.findOne({ email: verifyRefreshToken.email });

  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (
    isExist.isActive === IsActive.BLOCKED ||
    isExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isExist.isActive}`);
  }
  if (isExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }

  const jwtPayload = {
    email: isExist.email,
    role: isExist.role,
    userId: isExist._id,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN,
  );

  return accessToken
 
}