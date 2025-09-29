export const TYPES = {
  GenerateOtpHandler: Symbol.for("GenerateOtpHandler"),
  VerifyOtpHandler: Symbol.for("VerifyOtpHandler"),
  CreateUserHandler: Symbol.for("CreateUserHandler"),

  OtpController: Symbol.for("OtpController"),
  AuthController: Symbol.for("AuthController"),

  OtpRepository: Symbol.for("OtpRepository"),
  EmailRepository: Symbol.for("EmailRepository"),
  UserRepository: Symbol.for("UserRepository"),

  AuthService: Symbol.for("AuthService"),
  LoginService: Symbol.for("LoginService"),

  /* User */
  SettingsHandler: Symbol.for("SettingsHandler"),
  UserController: Symbol.for("UserController"),
  // ChangePasswordHandler: Symbol.for("ChangePasswordHandler"),
  AuthChangePasswordHandler: Symbol.for("AuthChangePasswordHandler"),
  GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),
  GetUserProfileHandler: Symbol.for("GetUserProfileHandler"),
  LoginChangePasswordHandler: Symbol.for("LoginChangePasswordHandler"),
  UpdateUserHandler: Symbol.for("UpdateUserHandler"),
  BlockUserHandler: Symbol.for("BlockUserHandler"),

  /* Community */
  CommunityRepository: Symbol.for("CommunityRepository"),
  ImageUploadService: Symbol.for("ImageUploadService"),
  CreateCommunityHandler: Symbol.for("CreateCommunityHandler"),
  CommunityController: Symbol.for("CommunityController"),
  UploadMiddleware: Symbol.for("UploadMiddleware"),

  LoadCommunityHandler: Symbol.for("LoadCommunityHandler"),
  LoadCommunitiesHandler: Symbol.for("LoadCommunitesHandler"),
  ListCommunitiesHandler: Symbol.for("ListCommunitiesHandler"),
  JoinCommunityHandler: Symbol.for("JoinCommunityHandler"),
  LeaveCommunityHandler: Symbol.for("LeaveCommunityHandler"),
  UpdateCommunityHandler: Symbol.for("UpdateCommunityHandler"),
  DeleteCommunityHandler: Symbol.for("DeleteCommunityHandler"),

  PostRepository: Symbol.for("PostRepository"),
  FileUploadService: Symbol.for("FileUploadService"),
  CreateCommunityPostHandler: Symbol.for("CreateCommunityPostHandler"),
  UpdateCommunityPostHandler: Symbol.for("UpdateCommunityPostHandler"),
  DeleteCommunityPostHandler: Symbol.for("DeleteCommunityPostHandler"),
  GetCommunityPostQueryHandler: Symbol.for("GetCommunityPostQueryHandler"),
  GetCommunityPostsQueryHandler: Symbol.for("GetCommunityPostsQueryHandler"),
  PostController: Symbol.for("PostController"),
  CommunityImageUploadMiddleware: Symbol.for("CommunityImageUploadMiddleware"),

  //* ========== Redis ========== *//
  RedisClient: Symbol.for("RedisClient"),
  RedisAuthService: Symbol.for("RedisAuthService"),
  RedisAuthConfig: Symbol.for("RedisAuthConfig"),

  //* ========== Middlewares ========== *//
  AuthMiddleware: Symbol.for("AuthMiddleware"),

  EmailConfig: Symbol.for("EmailConfig"),
  Logger: Symbol.for("Logger"),
  GetUsersQueryHandler: Symbol.for("GetUsersQueryHandler"),
};
