import express from "express";
import "reflect-metadata";
import cors from "cors";
import { createServer, Server as HttpServer } from "http";
import connectToDatabase from "./infrastructure/database/mongoose-connection";
import dotenv from "dotenv";
import { configFrontend } from "./infrastructure/config/ConfigSetup";
import path from "path";
import fs from "fs";
import * as rfs from "rotating-file-stream";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { Request, Response } from "express";

import authRoute from "./presentation/routes/auth.route";
import sharedRoute from "./presentation/routes/shared.route";
import userRoute from "./presentation/routes/user.route";
import morgan from "morgan";

dotenv.config();

const allowOrigins = [
  configFrontend.frontendUrl,
  configFrontend.frontendUrlProd,
  configFrontend.frontendUrlProdNew,
];

/* Cors Setup */
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allowed: boolean) => void) => {
    if (!origin || allowOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by the CORS"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  credentials: true,
  optionsSuccessStatus: 200,
};

/* Start the server */
const startServer = async (app: express.Express, server: HttpServer, port: string | number) => {
  try {
    await connectToDatabase();
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to bootstrap application: ", error);
    process.exit(1);
  }
};

async function bootstrap(): Promise<void> {
  /* Initialize Express & HTTP app */
  const app = express();
  const server = createServer(app);
  const PORT = process.env.APP_PORT || 5000;

  /* Logging setup */
  const logDirectory = path.join(__dirname, `logs`);
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }
  const errorLogStream = rfs.createStream("error.log", {
    interval: "1d",
    path: logDirectory,
    maxFiles: 7,
  });

  /* Middleware */
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    logger("combined", {
      stream: errorLogStream,
      skip: (req: Request, res: Response) => res.statusCode < 400,
    })
  );

  /* Routes */
  app.use("/auth", authRoute);
  app.use("/", sharedRoute);
  app.use("/user", userRoute);

  /* Start server */
  startServer(app, server, PORT);
}

bootstrap().catch(console.error);
