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
  LoginChangePasswordHandler: Symbol.for("LoginChangePasswordHandler"),
  UpdateUserHandler: Symbol.for("UpdateUserHandler"),
  CreateUserHandler: Symbol.for("CreateUserHandler"),
  BlockUserHandler: Symbol.for("BlockUserHandler"),

  /* Community */
  CommunityRepository: Symbol.for("CommunityRepository"),
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

  PostRepository: Symbol.for("PostRepository"),
  FileUploadService: Symbol.for("FileUploadService"),
  CreateCommunityPostHandler: Symbol.for("CreateCommunityPostHandler"),
  UpdateCommunityPostHandler: Symbol.for("UpdateCommunityPostHandler"),
  DeleteCommunityPostHandler: Symbol.for("DeleteCommunityPostHandler"),
  GetCommunityPostQueryHandler: Symbol.for("GetCommunityPostQueryHandler"),
  GetCommunityPostsQueryHandler: Symbol.for("GetCommunityPostsQueryHandler"),
  PostController: Symbol.for("PostController"),
  CommunityImageUploadMiddleware: Symbol.for("CommunityImageUploadMiddleware"),
};
