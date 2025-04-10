import { Container } from "inversify";
import { GenerateOtpCommand } from "../../application/use-cases/commands/GenerateOtp.command";
import { TYPES } from "./Types";
import { VerifyOtpCommand } from "../../application/use-cases/commands/VerifyOtp.command";
import { CreateUserCommand } from "../../application/use-cases/commands/Signup.command";
import OtpController from "../controllers/Otp.controller";
import AuthController from "../controllers/Auth.controller";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/Otp.repository";
import EmailServiceImpl from "../../application/services/OtpService";
import { UserRepositoryImpl } from "../../infrastructure/repositories/User.repository";
import { EmailService } from "../../domain/interfaces/services/email.service";
import { AuthService } from "../../application/services/Auth.service";

const container = new Container();

//Register use cases
container
  .bind<GenerateOtpCommand>(TYPES.GenerateOtpCommand)
  .to(GenerateOtpCommand)
  .inSingletonScope();
container.bind<VerifyOtpCommand>(TYPES.VerifyOtpCommand).to(VerifyOtpCommand).inSingletonScope();
container.bind<CreateUserCommand>(TYPES.CreateUserCommand).to(CreateUserCommand).inSingletonScope();

//Register controllers with factory-like binding
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<OtpController>(TYPES.OtpController).to(OtpController).inSingletonScope();

container.bind<EmailService>(TYPES.EmailService).to(EmailServiceImpl).inSingletonScope();
container.bind<OtpRepositoryImpl>(TYPES.OtpRepository).to(OtpRepositoryImpl).inSingletonScope();
container.bind<UserRepositoryImpl>(TYPES.UserRepository).to(UserRepositoryImpl).inSingletonScope();

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

export { container };
