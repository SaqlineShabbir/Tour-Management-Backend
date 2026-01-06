import express, { type NextFunction, type Request, type Response } from "express";
import { userRoutes } from "./modules/user/user.route";
import cors from "cors"
import { success } from "zod";
import { envVars } from "./config/env";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { router } from "./routes";
const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1",router)

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message:"Welcome to Tour Managemet System"
    })
})

// handle error globally
app.use(globalErrorHandler)

export default app