import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";

const credintialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credintialsLogin(req.body);

    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: loginInfo,
      message: "User logged in successfully",
    });
  },
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await AuthServices.getNewAccessTokenService(refreshToken);
    // res.cookie("accessToken",tokenInfo.accessToken,{
    //     httpOnly: true,
    //   secure: false,
    // })
    // res.cookie("accessToken",tokenInfo.accessToken,{
    //     httpOnly: true,
    //   secure: false,
    // })
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: tokenInfo,
      message: "New access token retrived successfully",
    });
  },
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: null,
      message: "User logged out successfully",
    });
  },
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user
    const reset = await AuthServices.resetPasswordService(
      oldPassword,
      newPassword,
      decodedToken
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: null,
      message: "Password changed successfully",
    });
  },
);

export const authController = {
  credintialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
