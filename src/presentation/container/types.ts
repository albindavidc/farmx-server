export const TYPES = {
  GenerateOtpCommand: Symbol.for("GenerateOtpCommand"),
  VerifyOtpCommand: Symbol.for("VerifyOtpCommand"),
  CreateUserCommand: Symbol.for("CreateUserCommand"),

  OtpController: Symbol.for("OtpController"),
  AuthController: Symbol.for("AuthController"),

  OtpRepository: Symbol.for("OtpRepository"),
  EmailService: Symbol.for("EmailService"),
  UserRepository: Symbol.for("UserRepository"),

  AuthService: Symbol.for("AuthService"),
  LoginService: Symbol.for("LoginService"),
};
