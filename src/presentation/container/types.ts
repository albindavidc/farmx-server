export const TYPES = {
  GenerateOtpHandler: Symbol.for("GenerateOtpHandler"),
  VerifyOtpHandler: Symbol.for("VerifyOtpHandler"),
  CreateUserHandler: Symbol.for("CreateUserHandler"),

  OtpController: Symbol.for("OtpController"),
  AuthController: Symbol.for("AuthController"),

  OtpRepository: Symbol.for("OtpRepository"),
  IEmailRepository: Symbol.for("IEmailRepository"),
  UserRepository: Symbol.for("UserRepository"),

  AuthService: Symbol.for("AuthService"),
  LoginService: Symbol.for("LoginService"),

  /* User */
  SettingsHandler: Symbol.for("SettingsHandler"),
  UserController: Symbol.for("UserController"),
  ChangePasswordUseCase: Symbol.for("ChangePasswordUseCase"),
  ChangePasswordHandler: Symbol.for("ChangePasswordHandler"),
  GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),
  GetUserProfileHandler: Symbol.for("GetUserProfileHandler"),
  LoginChangePasswordHandler: Symbol.for("LoginChangePasswordHandler"),
  UpdateUserHandler: Symbol.for("UpdateUserHandler"),
  BlockUserHandler: Symbol.for("BlockUserHandler"),

  /* Community */
  ICommunityRepository: Symbol.for("ICommunityRepository"),
  ImageuploadService: Symbol.for("ImageUploadService"),
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

  IPostRepository: Symbol.for("IPostRepository"),
  FileUploadService: Symbol.for("FileUploadService"),
  CreateCommunityPostHandler: Symbol.for("CreateCommunityPostHandler"),
  UpdateCommunityPostHandler: Symbol.for("UpdateCommunityPostHandler"),
  DeleteCommunityPostHandler: Symbol.for("DeleteCommunityPostHandler"),
  GetCommunityPostQueryHandler: Symbol.for("GetCommunityPostQueryHandler"),
  GetCommunityPostsQueryHandler: Symbol.for("GetCommunityPostsQueryHandler"),
  PostController: Symbol.for("PostController"),
  CommunityImageUploadMiddleware: Symbol.for("CommunityImageUploadMiddleware"),

  //* ========== Mappers ========== *//
  UserMapper: Symbol.for("UserMapper"),
  CommunityMapper: Symbol.for("CommunityMapper"),
  PostMapper: Symbol.for("PostMapper"),

  //* ========== Redis ========== *//
  RedisAuthService: Symbol.for("RedisAuthService"),

  //* ========== Middlewares ========== *//
  AuthMiddleware: Symbol.for("AuthMiddleware"),
};
