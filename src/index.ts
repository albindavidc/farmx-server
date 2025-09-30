import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import fs from "fs";
import { createServer, Server as HttpServer } from "http";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import * as rfs from "rotating-file-stream";
import { fileURLToPath } from "url";

import { configFrontend } from "@infrastructure/config/config-setup.js";
import connectToDatabase from "@infrastructure/database/mongoose-connection.js";
import { container } from "@presentation/container/inversify.config.js";
import { RedisClient } from "@infrastructure/database/redis/redisClient.js";
import { TYPES } from "@presentation/container/types.js";
import authRoute from "@presentation/routes/auth.route.js";
import communityRoute from "@presentation/routes/community.routes.js";
import sharedRoute from "@presentation/routes/shared.route.js";
import userRoute from "@presentation/routes/user.route.js";
import winston from "winston";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      console.error(`CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  credentials: true,
  optionsSuccessStatus: 200,
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

/* Setup logging */
function setupLogging(app: express.Express): void {
  const logDirectory = path.join(__dirname, "logs");

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  const errorLogStream = rfs.createStream("error.log", {
    interval: "1d",
    path: logDirectory,
    maxFiles: 7,
  });

  app.use(morgan("dev"));
  app.use(
    morgan("combined", {
      stream: errorLogStream,
      skip: (req: Request, res: Response) => res.statusCode < 400,
    })
  );

  app.use(
    morgan("combined", {
      skip: (req: Request, res: Response) => res.statusCode < 400,
      stream: {
        write: (message: string) => logger.error(message.trim()),
      },
    })
  );
}

/* Setup middleware */
function setupMiddleware(app: express.Express): void {
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupLogging(app);
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
}

/* Setup routes */
function setupRoutes(app: express.Express): void {
  app.use("/auth", authRoute);
  app.use("/", sharedRoute);
  app.use("/api", userRoute);
  app.use("/community", communityRoute);
}

/* Start the server */
async function startServer(
  app: express.Express,
  server: HttpServer,
  port: string | number
): Promise<void> {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Connect to Redis
    const redisClient = container.get<RedisClient>(TYPES.RedisClient);
    await redisClient.connect();

    server.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to bootstrap application:", error);
    process.exit(1);
  }
}

/* Graceful shutdown */
function setupGracefulShutdown(server: HttpServer): void {
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log("HTTP server closed");

      try {
        const redisClient = container.get<RedisClient>(TYPES.RedisClient);
        await redisClient.disconnect();
        console.log("Redis disconnected");
        process.exit(0);
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

async function bootstrap(): Promise<void> {
  const app = express();
  const server = createServer(app);
  const PORT = process.env.APP_PORT || 5000;

  setupMiddleware(app);
  setupRoutes(app);
  setupGracefulShutdown(server);

  await startServer(app, server, PORT);
}

bootstrap().catch((error) => {
  console.error("Fatal error during bootstrap:", error);
  process.exit(1);
});
