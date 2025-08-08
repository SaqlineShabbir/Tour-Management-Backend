import {Server} from "http";
import express, { type Request, type Response } from "express";
import mongoose from "mongoose"
import app from "./app";
let server:Server;


const startserver = async ()=>{
 try {
     await mongoose.connect("mongodb://localhost:27017/tour-management-system")
  console.log("Connected to DB")

  server = app.listen(5000,()=>{
    console.log("server is listening to port 5000")
  })
 } catch (error) {
    console.log(error)
 }
}

startserver()

