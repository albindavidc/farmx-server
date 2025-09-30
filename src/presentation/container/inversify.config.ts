// src/presentation/container/inversify.config.ts
import { Container } from "inversify";

import { TYPES } from "@presentation/container/types";
import { GenerateOtpHandler } from "@application/handlers/command/auth/generate-otp.handler.js";
import { SettingsHandler } from "@application/handlers/command/auth/settings.handler.js";
import { VerifyOtpHandler } from "@application/handlers/command/auth/verify-otp.handler.js";
// import { ChangePasswordHandler } from "@application/handlers/command/change-password.handler.js";
import { CreateCommunityHandler } from "@application/handlers/command/community/create-community.handler.js";
import { DeleteCommunityCommandHandler } from "@application/handlers/command/community/delete-community.handler.js";
import { JoinCommunityHandler } from "@application/handlers/command/community/join-community.handler.js";
import { LeaveCommunityHandler } from "@application/handlers/command/community/leave-community.handler.js";
import { CreateCommunityPostHandler } from "@application/handlers/command/community/post/create-post.handler.js";
import { DeleteCommunityPostHandler } from "@application/handlers/command/community/post/delete-post.handler.js";
import { UpdateCommunityPostHandler } from "@application/handlers/command/community/post/update-post.handler.js";
import { UpdateCommunityCommandHandler } from "@application/handlers/command/community/update-community.handler.js";
import { LoginChangePasswordHandler } from "@application/handlers/command/login-change-password.handler.js";
import { BlockUserHandler } from "@application/handlers/command/user/block-user.handler.js";
import { CreateUserHandler } from "@application/handlers/command/user/create-user.handler.js";
import { UpdateUserHandler } from "@application/handlers/command/user/update-user.handler.js";
import { GetCommunityPostsQueryHandler } from "@application/handlers/query/community/post/get-community-post.handler.js";
import { GetCommunityPostQueryHandler } from "@application/handlers/query/community/post/get-post.handler.js";
import { ListCommunitiesHandler } from "@application/handlers/query/community/list-communities.handler.js";
import { LoadCommunitiesHandler } from "@application/handlers/query/community/load-communities.handler.js";
import { LoadCommunityHandler } from "@application/handlers/query/community/load-community.handler.js";
import { RedisClient } from "@infrastructure/database/redis/redisClient.js";
import { CommunityRepositoryImpl } from "@infrastructure/repositories/community.repository.js";
import { OtpRepositoryImpl } from "@infrastructure/repositories/otp.repository.js";
import { PostRepositoryImpl } from "@infrastructure/repositories/post.repository.js";
import { UserRepositoryImpl } from "@infrastructure/repositories/user.repository.js";
import { AuthService } from "@infrastructure/services/auth/auth.service.js";
import { RedisAuthService } from "@infrastructure/services/auth/redis-auth.service.js";
import { ImageUploadService } from "@infrastructure/services/image-upload.service.js";
import { EmailServiceImpl } from "@infrastructure/services/otp.service.js";
import AuthController from "@presentation/controllers/auth.controller.js";
import { CommunityController } from "@presentation/controllers/community.controller.js";
import OtpController from "@presentation/controllers/otp.controller.js";
import { PostController } from "@presentation/controllers/post.controller.js";
import { UserController } from "@presentation/controllers/user.controller.js";
import { AuthMiddleware } from "@presentation/middlewares/auth.middleware.js";
import { CommunityImageUploadMiddleware } from "@presentation/middlewares/community-image-upload.middleware.js";
import { UploadMiddleware } from "@presentation/middlewares/upload-middleware.js";
import { AuthChangePasswordHandler } from "@application/handlers/command/auth/auth-change-password.handler.js";
import winston from "winston";
import { configBrevo } from "@infrastructure/config/config-setup.js";
import { IRedisAuthConfig } from "@infrastructure/services/auth/redis-auth.service.js";
import { GetUsersQueryHandler } from "@application/handlers/query/user/get-users-query.handler.js";
import { SignupHandler } from "@application/handlers/command/auth/signup.handler.js";
import { LoginHandler } from "@application/handlers/command/auth/login.handler.js";

const container = new Container();

// DEBUG: Find undefined symbols
console.log("\n========== TYPES VALIDATION ==========");
for (const [key, value] of Object.entries(TYPES)) {
  if (value === undefined) {
    console.error(`❌ TYPES.${key} is UNDEFINED!`);
  } else {
    console.log(`✓ TYPES.${key}:`, String(value));
  }
}
console.log("======================================\n");

// Register use cases
container
  .bind<GenerateOtpHandler>(TYPES.GenerateOtpHandler)
  .to(GenerateOtpHandler)
  .inSingletonScope();
container.bind<VerifyOtpHandler>(TYPES.VerifyOtpHandler).to(VerifyOtpHandler).inSingletonScope();
container.bind<CreateUserHandler>(TYPES.CreateUserHandler).to(CreateUserHandler).inSingletonScope();

// Register controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<OtpController>(TYPES.OtpController).to(OtpController).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container
  .bind<CommunityController>(TYPES.CommunityController)
  .to(CommunityController)
  .inSingletonScope();
container.bind<PostController>(TYPES.PostController).to(PostController).inSingletonScope();

// Register repositories
container.bind<EmailServiceImpl>(TYPES.EmailRepository).to(EmailServiceImpl).inSingletonScope();
container.bind<OtpRepositoryImpl>(TYPES.OtpRepository).to(OtpRepositoryImpl).inSingletonScope();
container.bind<UserRepositoryImpl>(TYPES.UserRepository).to(UserRepositoryImpl).inSingletonScope();
container
  .bind<CommunityRepositoryImpl>(TYPES.CommunityRepository)
  .to(CommunityRepositoryImpl)
  .inSingletonScope();
container.bind<PostRepositoryImpl>(TYPES.PostRepository).to(PostRepositoryImpl).inSingletonScope();

// Register services
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<LoginHandler>(TYPES.LoginHandler).to(LoginHandler).inSingletonScope();
container.bind<SignupHandler>(TYPES.SignupHandler).to(SignupHandler).inSingletonScope();
container
  .bind<ImageUploadService>(TYPES.ImageUploadService)
  .to(ImageUploadService)
  .inSingletonScope();

container.bind<RedisClient>(TYPES.RedisClient).to(RedisClient).inSingletonScope();
container.bind<RedisAuthService>(TYPES.RedisAuthService).to(RedisAuthService).inSingletonScope();

// User handlers
container.bind<SettingsHandler>(TYPES.SettingsHandler).to(SettingsHandler).inSingletonScope();
// container.bind<ChangePasswordHandler>(TYPES.ChangePasswordHandler).to(ChangePasswordHandler).inSingletonScope();
container
  .bind<AuthChangePasswordHandler>(TYPES.AuthChangePasswordHandler)
  .to(AuthChangePasswordHandler)
  .inSingletonScope();
container
  .bind<LoginChangePasswordHandler>(TYPES.LoginChangePasswordHandler)
  .to(LoginChangePasswordHandler)
  .inSingletonScope();
container.bind<UpdateUserHandler>(TYPES.UpdateUserHandler).to(UpdateUserHandler).inSingletonScope();
container.bind<BlockUserHandler>(TYPES.BlockUserHandler).to(BlockUserHandler).inSingletonScope();

// Community handlers
container
  .bind<CreateCommunityHandler>(TYPES.CreateCommunityHandler)
  .to(CreateCommunityHandler)
  .inSingletonScope();
container
  .bind<LoadCommunitiesHandler>(TYPES.LoadCommunitiesHandler)
  .to(LoadCommunitiesHandler)
  .inSingletonScope();
container
  .bind<LoadCommunityHandler>(TYPES.LoadCommunityHandler)
  .to(LoadCommunityHandler)
  .inSingletonScope();
container
  .bind<ListCommunitiesHandler>(TYPES.ListCommunitiesHandler)
  .to(ListCommunitiesHandler)
  .inSingletonScope();
container
  .bind<JoinCommunityHandler>(TYPES.JoinCommunityHandler)
  .to(JoinCommunityHandler)
  .inSingletonScope();
container
  .bind<LeaveCommunityHandler>(TYPES.LeaveCommunityHandler)
  .to(LeaveCommunityHandler)
  .inSingletonScope();
container
  .bind<UpdateCommunityCommandHandler>(TYPES.UpdateCommunityHandler)
  .to(UpdateCommunityCommandHandler)
  .inSingletonScope();
container
  .bind<DeleteCommunityCommandHandler>(TYPES.DeleteCommunityHandler)
  .to(DeleteCommunityCommandHandler)
  .inSingletonScope();

// Community post handlers
container
  .bind<CreateCommunityPostHandler>(TYPES.CreateCommunityPostHandler)
  .to(CreateCommunityPostHandler)
  .inSingletonScope();
container
  .bind<UpdateCommunityPostHandler>(TYPES.UpdateCommunityPostHandler)
  .to(UpdateCommunityPostHandler)
  .inSingletonScope();
container
  .bind<DeleteCommunityPostHandler>(TYPES.DeleteCommunityPostHandler)
  .to(DeleteCommunityPostHandler)
  .inSingletonScope();
container
  .bind<GetCommunityPostsQueryHandler>(TYPES.GetCommunityPostsQueryHandler)
  .to(GetCommunityPostsQueryHandler)
  .inSingletonScope();
container
  .bind<GetCommunityPostQueryHandler>(TYPES.GetCommunityPostQueryHandler)
  .to(GetCommunityPostQueryHandler)
  .inSingletonScope();

// Middleware
container.bind<UploadMiddleware>(TYPES.UploadMiddleware).to(UploadMiddleware).inSingletonScope();
container
  .bind<CommunityImageUploadMiddleware>(TYPES.CommunityImageUploadMiddleware)
  .to(CommunityImageUploadMiddleware)
  .inSingletonScope();
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

/* Logger */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

/* Email Config */
const emailConfig = {
  smtpServer: configBrevo.BREVO.SMTP_SERVER,
  port: configBrevo.BREVO.PORT,
  secure: false,
  login: configBrevo.BREVO.LOGIN,
  password: configBrevo.BREVO.PASSWORD,
  fromAddress: configBrevo.EMAIL_FROM,
};

container.bind(TYPES.Logger).toConstantValue(logger);
container.bind(TYPES.EmailConfig).toConstantValue(emailConfig);

const redisAuthConfig: IRedisAuthConfig = {
  SESSION_PREFIX: "auth:session:",
  REFRESH_PREFIX: "auth:refresh:",
  RATE_LIMIT_PREFIX: "auth:ratelimit:",
  SESSION_TTL: 60 * 60 * 24 * 7,
  REFRESH_TTL: 60 * 60 * 24 * 7,
  RATE_LIMIT_TTL: 60 * 60 * 24 * 7,
  MAX_LOGIN_ATTEMPTS: 5,
};

container.bind(TYPES.RedisAuthConfig).toConstantValue(redisAuthConfig);

container.bind<GetUsersQueryHandler>(TYPES.GetUsersQueryHandler).to(GetUsersQueryHandler);

export { container };
