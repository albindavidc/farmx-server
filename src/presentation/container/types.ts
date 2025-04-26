export const TYPES = {
  GenerateOtpUseCase: Symbol.for("GenerateOtpUseCase"),
  VerifyOtpUseCase: Symbol.for("VerifyOtpUseCase"),
  CreateUserUseCase: Symbol.for("CreateUserUseCase"),

  OtpController: Symbol.for("OtpController"),
  AuthController: Symbol.for("AuthController"),

  OtpRepository: Symbol.for("OtpRepository"),
  EmailService: Symbol.for("EmailService"),
  UserRepository: Symbol.for("UserRepository"),

  AuthService: Symbol.for("AuthService"),
  LoginService: Symbol.for("LoginService"),

  /* User */
  SettingsUseCase: Symbol.for("SettingsUseCase"),
  UserController: Symbol.for("UserController"),
  ChangePasswordUseCase: Symbol.for("ChangePasswordUseCase"),
  ChangePasswordHandler: Symbol.for("ChangePasswordHandler"),
  GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),
  GetUserProfileHandler: Symbol.for("GetUserProfileHandler"),

  /* Community */
  CommunityRepository: Symbol.for("CommunityRepository"),
  ImageuploadService: Symbol.for("ImageUploadService")

};
