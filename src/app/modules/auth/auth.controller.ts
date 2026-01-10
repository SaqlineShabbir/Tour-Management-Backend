import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";


const credintialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
    const loginInfo = await AuthServices.credintialsLogin(req.body);

   
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: loginInfo,
      message: "User logged in successfully",
    });
  }
);

export const authController = {
  credintialsLogin,
};