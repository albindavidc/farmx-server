import express from "express";
import { connectToDatabase } from "./infrastructure/persistence/mongodb/connection";

import { AuthController } from "./presentation/controllers/auth.controller";
import { createAuthRoutes } from "./presentation/routes/auth.routes";
import { SimpleCommandBus } from "./infrastructure/command-bus/simple.command-bus";

async function bootstrap() {
  await connectToDatabase();

  const commandBus = new SimpleCommandBus();
  const authController = new AuthController(commandBus);

  const app = express();
  app.use(express.json());

  app.use("/api/auth", createAuthRoutes(authController));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

bootstrap().catch(console.error);
