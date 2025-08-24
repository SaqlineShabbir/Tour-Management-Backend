import type { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"


export const globalErrorHandler = (err:any,req:Request,res:Response,next:NextFunction)=>{

    const statusCode =  500

    res.status(statusCode).json({
        success:false,
        message:`Something went wrong ${err.message}`,
        error: err,
        stack: envVars.NODE_ENV === "development" ? err.stack : undefined
    })
}