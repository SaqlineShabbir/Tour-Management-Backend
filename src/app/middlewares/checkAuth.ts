import type { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import type { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(401, "Unauthorized access");
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET);

      if (!verifiedToken) {
        throw new AppError(401, "Unauthorized access");
      }
      const role = (verifiedToken as JwtPayload).role;

      if (!authRoles.includes(role)) {
        throw new AppError(403, "Forbidden access");
      }
      next();
    } catch (error) {
      next(error);
    }
  };