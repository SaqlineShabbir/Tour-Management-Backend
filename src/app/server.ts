import {Server} from "http";
import express, { type Request, type Response } from "express";
import mongoose from "mongoose"
import app from "./app";
import { envVars } from "./config/env";
let server:Server;

let a;
const startserver = async ()=>{
 try {
   console.log(envVars.NODE_ENV)
     await mongoose.connect(envVars.DB_URL)
  console.log("Connected to DB")

  server = app.listen(envVars.PORT,()=>{
    console.log(`server is listening to port ${envVars.PORT}`)
  })
 } catch (error) {
    console.log(error)
 }
}

startserver()

process.on("unhandledRejection",()=>{
   console.log("Unhandled Rejection deceted server shutting down..")
   if(server){
      server.close(()=>{
         process.exit(1)
      })
   }

   process.exit(1)
})

