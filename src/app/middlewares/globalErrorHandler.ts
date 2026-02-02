import type { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = `Something went wrong ! ${err.message}`;
  if (err.code === "11000") {
    const duplicate = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${duplicate[1]} already exists ! Please use another email.`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((value: any) => value.message)
      .join(", ");
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again!";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired! Please log in again.";
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = "zod error occurred";

    err.issues.forEach((issue: any) => {
      message += ` ${issue.path[0]}: ${issue.message}.`;
    });
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: `Something went wrong ${err.message}`,
    error: err,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
  });
};
