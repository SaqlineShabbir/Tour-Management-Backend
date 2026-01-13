import { Server } from "http";
import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./utils/seedSuperAdmin";
let server: Server;

let a;
const startserver = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to DB");

    server = app.listen(envVars.PORT, () => {
      console.log(`server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startserver();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", () => {
  console.log("Unhandled Rejection deceted server shutting down..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
