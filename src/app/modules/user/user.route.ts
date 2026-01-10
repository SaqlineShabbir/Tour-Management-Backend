import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import type { ZodObject } from "zod";
import { validateRequest } from "../../middlewares/validateRequest";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { Role } from "./user.interface";
import { envVars } from "../../config/env";
import { verifyToken } from "../../utils/jwt";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);
export const userRoutes = router;
