import type { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User Created Successfully",
      user,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const userController = {
  createUser,
};
