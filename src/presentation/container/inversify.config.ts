import { Container } from "inversify";
import { GenerateOtpCommand } from "../../application/use-cases/commands/GenerateOtp.command";
import { TYPES } from "./types";
import { VerifyOtpCommand } from "../../application/use-cases/commands/VerifyOtp.command";
import { CreateUserCommand } from "../../application/use-cases/commands/Signup.command";
import OtpController from "../controllers/otp.controller";
import AuthController from "../controllers/auth.controller";

const container = new Container();

//Register use cases
container
  .bind<GenerateOtpCommand>(TYPES.GenerateOtp)
  .to(GenerateOtpCommand)
  .inSingletonScope();
container
  .bind<VerifyOtpCommand>(TYPES.VerifyOtp)
  .to(VerifyOtpCommand)
  .inSingletonScope();
container
  .bind<CreateUserCommand>(TYPES.CreateUser)
  .to(CreateUserCommand)
  .inSingletonScope();

//Register controllers with factory-like binding
container.bind<OtpController>(TYPES.Otpcontroller).to(OtpController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

export { container };
