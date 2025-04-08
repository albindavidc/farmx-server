import express from "express";
import "reflect-metadata";
import cors from "cors";

import connectToDatabase from "./infrastructure/database/MongooseConnection";
import { createAuthRoutes } from "./presentation/routes/Auth.route";

import dotenv from "dotenv";
dotenv.config();

async function bootstrap(): Promise<void> {
  try {
    await connectToDatabase();

    //Initialize Express app
    const app = express();

    //Middleware
    app.use(express.json());
    app.use(cors());

    app.use("/api/auth", createAuthRoutes());

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to bootstrap application: ", error);
  }
}

bootstrap().catch(console.error);
