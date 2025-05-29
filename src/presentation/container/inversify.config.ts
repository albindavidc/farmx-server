import { Container } from "inversify";
import { TYPES } from "./types";
import OtpController from "../controllers/otp.controller";
import AuthController from "../controllers/auth.controller";
import EmailServiceImpl from "../../application/services/Otp.service";
import { EmailService } from "../../domain/interfaces/services/email.service";
import { AuthService } from "../../application/services/Auth.service";
import { LoginService } from "../../application/services/Login.service";
import { UserController } from "../controllers/user.controller";
import { SettingsUseCase } from "../../application/use-cases/use-cases/Settings.use-case";
import { VerifyOtpUseCase } from "../../application/use-cases/use-cases/VerifyOtp.use-case";
import { CreateUserUseCase } from "../../application/use-cases/use-cases/Signup.use-case";
import { GenerateOtpUseCase } from "../../application/use-cases/use-cases/GenerateOtp.use-case";
import { ChangePasswordHandler } from "../../application/use-cases/handlers/change-password.handler";
import { ChangePasswordUseCase } from "../../application/use-cases/use-cases/ChangePassword.use-case";
import { CommunityRepository } from "../../domain/interfaces/repositories/community/community.repository";
import { CommunityRepositoryImpl } from "../../infrastructure/repositories/community.repository";
import { ImageUploadService } from "../../application/services/image-upload.service";
import { CreateCommunityHandler } from "../../application/use-cases/handlers/community/create-community.handler";
import { CommunityController } from "../controllers/community.controller";
import { UploadMiddleware } from "../middlewares/upload-middleware";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/otp.repository";
import { LoadCommunitiesHandler } from "../../application/use-cases/handlers/community/load-communities.handler";
import { LoadCommunityHandler } from "../../application/use-cases/handlers/community/load-community.handler";
import { JoinCommunityHandler } from "../../application/use-cases/handlers/community/join-community.handler";
import { LeaveCommunityHandler } from "../../application/use-cases/handlers/community/leave-community.handler";
import { PostRepository } from "../../domain/interfaces/repositories/community/post.repository";
import { UpdateCommunityPostHandler } from "../../application/use-cases/handlers/community/post/update-post.handler";
import { DeleteCommunityPostHandler } from "../../application/use-cases/handlers/community/post/delete-post.handler";
import { GetCommunityPostQueryHandler } from "../../application/use-cases/handlers/community/post/get-post.handler";
import { GetCommunityPostsQueryHandler } from "../../application/use-cases/handlers/community/post/get-community-post.handler";
import { CreateCommunityPostHandler } from "../../application/use-cases/handlers/community/post/create-post.handler";
import { PostRepositoryImpl } from "../../infrastructure/repositories/post.repository";
import { PostController } from "../controllers/post.controller";
import { CommunityImageUploadMiddleware } from "../middlewares/community-image-upload.middleware";
import { UpdateCommunityCommandHandler } from "../../application/use-cases/handlers/community/update-community.handler";
import { DeleteCommunityCommandHandler } from "../../application/use-cases/handlers/community/delete-community.handler";
import { ListCommunitiesHandler } from "../../application/use-cases/handlers/community/list-communities.handler";
import { LoginChangePasswordHandler } from "../../application/use-cases/handlers/login-change-password.handler";

const container = new Container();

//Register use cases
container
  .bind<GenerateOtpUseCase>(TYPES.GenerateOtpUseCase)
  .to(GenerateOtpUseCase)
  .inSingletonScope();
container.bind<VerifyOtpUseCase>(TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase).inSingletonScope();
container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase).inSingletonScope();

//Register controllers with factory-like binding
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<OtpController>(TYPES.OtpController).to(OtpController).inSingletonScope();

container.bind<EmailService>(TYPES.EmailService).to(EmailServiceImpl).inSingletonScope();
container.bind<OtpRepositoryImpl>(TYPES.OtpRepository).to(OtpRepositoryImpl).inSingletonScope();
container.bind<UserRepositoryImpl>(TYPES.UserRepository).to(UserRepositoryImpl).inSingletonScope();

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<LoginService>(TYPES.LoginService).to(LoginService).inSingletonScope();

/* User */
container.bind<SettingsUseCase>(TYPES.SettingsUseCase).to(SettingsUseCase).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container
  .bind<ChangePasswordHandler>(TYPES.ChangePasswordHandler)
  .to(ChangePasswordHandler)
  .inSingletonScope();
container
  .bind<ChangePasswordUseCase>(TYPES.ChangePasswordUseCase)
  .to(ChangePasswordUseCase)
  .inSingletonScope();
container
  .bind<LoginChangePasswordHandler>(TYPES.LoginChangePasswordHandler)
  .to(LoginChangePasswordHandler)
  .inSingletonScope();

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
