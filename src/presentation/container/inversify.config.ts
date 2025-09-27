import { Container } from "inversify";
import { TYPES } from "./types";

import { GenerateOtpHandler } from "@application/handlers/command/auth/generate-otp.handler";
import { SettingsHandler } from "@application/handlers/command/auth/settings.handler";
import { VerifyOtpHandler } from "@application/handlers/command/auth/verify-otp.handler";
import { ChangePasswordHandler } from "@application/handlers/command/change-password.handler";
import { CreateCommunityHandler } from "@application/handlers/command/community/create-community.handler";
import { DeleteCommunityCommandHandler } from "@application/handlers/command/community/delete-community.handler";
import { JoinCommunityHandler } from "@application/handlers/command/community/join-community.handler";
import { LeaveCommunityHandler } from "@application/handlers/command/community/leave-community.handler";
import { CreateCommunityPostHandler } from "@application/handlers/command/community/post/create-post.handler";
import { DeleteCommunityPostHandler } from "@application/handlers/command/community/post/delete-post.handler";
import { UpdateCommunityPostHandler } from "@application/handlers/command/community/post/update-post.handler";
import { UpdateCommunityCommandHandler } from "@application/handlers/command/community/update-community.handler";
import { LoginChangePasswordHandler } from "@application/handlers/command/login-change-password.handler";
import { BlockUserHandler } from "@application/handlers/command/user/block-user.handler";
import { CreateUserHandler } from "@application/handlers/command/user/create-user.handler";
import { UpdateUserHandler } from "@application/handlers/command/user/update-user.handler";
import { ListCommunitiesHandler } from "@application/handlers/query/community/list-communities.handler";
import { LoadCommunitiesHandler } from "@application/handlers/query/community/load-communities.handler";
import { LoadCommunityHandler } from "@application/handlers/query/community/load-community.handler";
import { GetCommunityPostsQueryHandler } from "@application/handlers/query/community/post/get-community-post.handler";
import { GetCommunityPostQueryHandler } from "@application/handlers/query/community/post/get-post.handler";
import { CommunityRepository } from "@domain/repositories/community/community.repository";
import { PostRepository } from "@domain/repositories/community/post.repository";
import { EmailRepository } from "@domain/repositories/email.repository";
import { CommunityRepositoryImpl } from "@infrastructure/repositories/community.repository";
import { OtpRepositoryImpl } from "@infrastructure/repositories/otp.repository";
import { PostRepositoryImpl } from "@infrastructure/repositories/post.repository";
import { UserRepositoryImpl } from "@infrastructure/repositories/user.repository";
import { AuthService } from "@infrastructure/services/auth/auth.service";
import { ImageUploadService } from "@infrastructure/services/image-upload.service";
import { LoginService } from "@infrastructure/services/login.service";
import { EmailServiceImpl } from "@infrastructure/services/otp.service";
import AuthController from "@presentation/controllers/auth.controller";
import { CommunityController } from "@presentation/controllers/community.controller";
import OtpController from "@presentation/controllers/otp.controller";
import { PostController } from "@presentation/controllers/post.controller";
import { UserController } from "@presentation/controllers/user.controller";
import { CommunityImageUploadMiddleware } from "@presentation/middlewares/community-image-upload.middleware";
import { UploadMiddleware } from "@presentation/middlewares/upload-middleware";

const container = new Container();

//Register use cases
container
  .bind<GenerateOtpHandler>(TYPES.GenerateOtpHandler)
  .to(GenerateOtpHandler)
  .inSingletonScope();
container.bind<VerifyOtpHandler>(TYPES.VerifyOtpHandler).to(VerifyOtpHandler).inSingletonScope();
container.bind<CreateUserHandler>(TYPES.CreateUserHandler).to(CreateUserHandler).inSingletonScope();

//Register controllers with factory-like binding
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<OtpController>(TYPES.OtpController).to(OtpController).inSingletonScope();

container.bind<EmailRepository>(TYPES.EmailRepository).to(EmailServiceImpl).inSingletonScope();
container.bind<OtpRepositoryImpl>(TYPES.OtpRepository).to(OtpRepositoryImpl).inSingletonScope();
container.bind<UserRepositoryImpl>(TYPES.UserRepository).to(UserRepositoryImpl).inSingletonScope();

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<LoginService>(TYPES.LoginService).to(LoginService).inSingletonScope();

/* User */
container.bind<SettingsHandler>(TYPES.SettingsHandler).to(SettingsHandler).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container
  .bind<ChangePasswordHandler>(TYPES.ChangePasswordHandler)
  .to(ChangePasswordHandler)
  .inSingletonScope();
container
  .bind<ChangePasswordHandler>(TYPES.ChangePasswordHandler)
  .to(ChangePasswordHandler)
  .inSingletonScope();
container
  .bind<LoginChangePasswordHandler>(TYPES.LoginChangePasswordHandler)
  .to(LoginChangePasswordHandler)
  .inSingletonScope();
container.bind<UpdateUserHandler>(TYPES.UpdateUserHandler).to(UpdateUserHandler).inSingletonScope();
container.bind<CreateUserHandler>(TYPES.CreateUserHandler).to(CreateUserHandler).inSingletonScope();
container.bind<BlockUserHandler>(TYPES.BlockUserHandler).to(BlockUserHandler).inSingletonScope();

/* Community */
container.bind<CommunityRepository>(TYPES.CommunityRepository).to(CommunityRepositoryImpl);
container.bind<ImageUploadService>(TYPES.ImageuploadService).to(ImageUploadService);
container.bind<CreateCommunityHandler>(TYPES.CreateCommunityHandler).to(CreateCommunityHandler);
container.bind<CommunityController>(TYPES.CommunityController).to(CommunityController);
container.bind<UploadMiddleware>(TYPES.UploadMiddleware).to(UploadMiddleware).inSingletonScope();

container.bind<LoadCommunitiesHandler>(TYPES.LoadCommunitiesHandler).to(LoadCommunitiesHandler);
container.bind<LoadCommunityHandler>(TYPES.LoadCommunityHandler).to(LoadCommunityHandler);
container.bind<ListCommunitiesHandler>(TYPES.ListCommunitiesHandler).to(ListCommunitiesHandler);
container.bind<JoinCommunityHandler>(TYPES.JoinCommunityHandler).to(JoinCommunityHandler);
container.bind<LeaveCommunityHandler>(TYPES.LeaveCommunityHandler).to(LeaveCommunityHandler);
container
  .bind<UpdateCommunityCommandHandler>(TYPES.UpdateCommunityHandler)
  .to(UpdateCommunityCommandHandler);
container
  .bind<DeleteCommunityCommandHandler>(TYPES.DeleteCommunityHandler)
  .to(DeleteCommunityCommandHandler);

/* Community Post */
container.bind<PostRepository>(TYPES.PostRepository).to(PostRepositoryImpl);
container
  .bind<CreateCommunityPostHandler>(TYPES.CreateCommunityPostHandler)
  .to(CreateCommunityPostHandler);
container
  .bind<UpdateCommunityPostHandler>(TYPES.UpdateCommunityPostHandler)
  .to(UpdateCommunityPostHandler);
container
  .bind<DeleteCommunityPostHandler>(TYPES.DeleteCommunityPostHandler)
  .to(DeleteCommunityPostHandler);
container
  .bind<GetCommunityPostQueryHandler>(TYPES.GetCommunityPostQueryHandler)
  .to(GetCommunityPostQueryHandler);
container
  .bind<GetCommunityPostsQueryHandler>(TYPES.GetCommunityPostsQueryHandler)
  .to(GetCommunityPostsQueryHandler);
container.bind<PostController>(TYPES.PostController).to(PostController);
container
  .bind<CommunityImageUploadMiddleware>(TYPES.CommunityImageUploadMiddleware)
  .to(CommunityImageUploadMiddleware)
  .inSingletonScope();
export { container };

