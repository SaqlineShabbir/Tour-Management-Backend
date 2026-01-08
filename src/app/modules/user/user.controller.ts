import type { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";



const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

export const userController = {
  createUser,
};
