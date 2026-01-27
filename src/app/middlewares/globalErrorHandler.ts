import type { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong ! ${err.message}`;
  if (err.code === "11000") {
    const duplicate = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${duplicate[1]} already exists ! Please use another email.`;
  }
  else if( err.name === "CastError" ) {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
  }
  else if (err instanceof AppError) {
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
