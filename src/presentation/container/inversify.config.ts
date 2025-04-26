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
import { CommunityRepository } from "../../domain/interfaces/repositories/community.repository";
import { UserRepositoryImpl } from "../../infrastructure/repositories/User.repository";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/Otp.repository";
import { CommunityRepositoryImpl } from "../../infrastructure/repositories/community.repository";
import { ImageUploadService } from "../../application/services/image-upload.service";

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

/* Community */
container.bind<CommunityRepository>(TYPES.CommunityRepository).to(CommunityRepositoryImpl);
container.bind<ImageUploadService>(TYPES.ImageuploadService).to(ImageUploadService)
export { container };
