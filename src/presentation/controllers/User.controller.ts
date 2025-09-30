import { Request, Response } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import path from "path";

import { ChangePasswordCommand } from "@application/commands/change-password.command.js";
import { LoginChangePasswordCommand } from "@application/commands/login-change-password.command.js";
import { UploadProfilePhotoCommand } from "@application/commands/upload-profile-photo.command.js";
import { BlockUserCommand } from "@application/commands/user/block-user.command.js";
import { CreateUserCommand } from "@application/commands/user/create-user.command.js";
import { UpdateUserCommand } from "@application/commands/user/update-user.command.js";
import { UserDto } from "@application/dtos/user.dto.js";
import { AuthChangePasswordHandler } from "@application/handlers/command/auth/auth-change-password.handler.js";
import { SettingsHandler } from "@application/handlers/command/auth/settings.handler.js";
import { LoginChangePasswordHandler } from "@application/handlers/command/login-change-password.handler.js";
import { BlockUserHandler } from "@application/handlers/command/user/block-user.handler.js";
import { CreateUserHandler } from "@application/handlers/command/user/create-user.handler.js";
import { UpdateUserHandler } from "@application/handlers/command/user/update-user.handler.js";
import { GetUsersQueryHandler } from "@application/handlers/query/user/get-users-query.handler.js";
import { GetUsersQuery } from "@application/queries/user/get-users.query.js";
import sendResponseJson from "@application/utils/message.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import logger from "@infrastructure/config/logger.config.js";
import { TYPES } from "@presentation/container/types.js";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.SettingsHandler) private readonly settingsUseCase: SettingsHandler,
    @inject(TYPES.UserRepository) private readonly userRepo: IUserRepository,
    @inject(TYPES.LoginChangePasswordHandler)
    private loginChangePasswordHandler: LoginChangePasswordHandler,
    @inject(TYPES.CreateUserHandler) private createUserHandler: CreateUserHandler,
    @inject(TYPES.UpdateUserHandler) private updateUserHandler: UpdateUserHandler,
    @inject(TYPES.BlockUserHandler) private blockUserHandler: BlockUserHandler,
    @inject(TYPES.AuthChangePasswordHandler)
    private authChangePasswordHandler: AuthChangePasswordHandler,
    @inject(TYPES.GetUsersQueryHandler) private getUserQueryHandler: GetUsersQueryHandler
  ) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortDirection = (req.query.sortDirection as "asc" | "desc") || "asc";
      const search = (req.query.search as string) || "";

      const query = new GetUsersQuery(page, limit, sortBy, sortDirection, search);

      const result = await this.getUserQueryHandler.execute(query);

      logger.info("Users fetched successfully", result);

      console.log("this is what getUsers have to offer");

      sendResponseJson(res, StatusCodes.OK, "Users fetched successfully", true, result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async uploadProfilePhoto(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        sendResponseJson(res, StatusCodes.BAD_REQUEST, "No file uploaded", false);
        return;
      }

      const userId = req.user?.id || req.body.userId;
      if (!userId) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "Not authorized", false);
        return;
      }

      const filePath = `uploads/profile/${req.file.filename}`;

      await this.settingsUseCase.executeProfilePhotoUpdate(
        new UploadProfilePhotoCommand(userId, filePath)
      );

      console.log(`You have successfully uploaded the file tothe back-end`);
      sendResponseJson(res, StatusCodes.OK, "Profile photo updated successfully", true, {
        filePath,
      });
    } catch (error) {
      console.error("Profile photo upload error:", error);
      sendResponseJson(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update profile photo",
        false,
        { error: error instanceof Error ? error.message : "Unknown error" }
      );
    }
  }

  async getProfilePhoto(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendResponseJson(res, StatusCodes.UNAUTHORIZED, "Not Authorized", false);
        return;
      }

      const filePath = await this.settingsUseCase.executeGetProfilePhotoHandler(userId);
      if (!filePath || !filePath.startsWith("uploads/profile/")) {
        sendResponseJson(res, StatusCodes.NOT_FOUND, "Profile photo not found", false);
        return;
      }

      const absolutePath = path.join(process.cwd(), filePath);
      console.log(absolutePath, "this is absolute path");

      if (!fs.existsSync(absolutePath)) {
        sendResponseJson(
          res,
          StatusCodes.NOT_FOUND,
          "Profile is available in the directory",
          false
        );
        return;
      }

      console.log(userId, filePath, "these are from the back-end");
      res.sendFile(absolutePath, (err) => {
        if (err) {
          sendResponseJson(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Error in retrieving the profile photo",
            false
          );
        }
      });
    } catch (error) {
      console.log("Get profile photo error" + error);
      sendResponseJson(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve the profile photo",
        false
      );
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const { name, email, phone } = req.body;
    try {
      const updatedUser = await this.settingsUseCase.executeUpdateProfile(req.user?.id, {
        name,
        email,
        phone,
      });

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(updatedUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Server Error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async validateOldPassword(req: Request, res: Response): Promise<void> {
    try {
      const { oldPassword } = req.body;
      const userId = req.user?.id;
      if (!userId || !oldPassword) {
        sendResponseJson(
          res,
          StatusCodes.BAD_REQUEST,
          "User Id and Old password are required",
          false
        );
        return;
      }

      const isValid = await this.userRepo.validatePassword(userId, oldPassword);
      sendResponseJson(res, StatusCodes.OK, "Validation result", true, { isValid });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { newPassword, confirmPassword } = req.body;
      const userId = req.user?.id;
      const command = new ChangePasswordCommand(userId, newPassword, confirmPassword);
      await this.authChangePasswordHandler.changePassword(
        command.userId,
        command.newPassword,
        command.confirmPassword
      );

      sendResponseJson(res, StatusCodes.OK, "Password changed successfully", true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      sendResponseJson(res, StatusCodes.BAD_REQUEST, errorMessage, false);
    }
  }

  async loginChangePassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, newPassword, confirmPassword } = req.body;
      const command = new LoginChangePasswordCommand(email, newPassword, confirmPassword);
      await this.loginChangePasswordHandler.execute(command);
      sendResponseJson(res, StatusCodes.OK, "Password Change Success", true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  // async getUsers(req: Request, res: Response): Promise<void> {
  //   try {
  //     const users = await this.userRepo.findAll();

  //     const transformedUsers = users.map((user) => {
  //       return {
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         role: user.role,
  //         phone: user.phone,
  //         isVerified: user.isVerified,
  //         isAdmin: user.isAdmin,
  //         isBlocked: user.isBlocked,
  //         googleId: user.googleId,

  //         isFarmer: user.isFarmer,
  //         farmerProfile: user.farmerProfile,
  //         profilePhoto: user.profilePhoto,
  //         bio: user.bio,
  //         courseProgress: user.courseProgress,
  //         reason: user.reason,
  //         courseCertificate: user.courseCertificate,
  //       };
  //     });

  //     sendResponseJson(res, StatusCodes.OK, "Successfully got all users", true, transformedUsers);
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
  //     sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
  //   }
  // }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body as UserDto;
      const command = new CreateUserCommand(userData);
      const user = await this.createUserHandler.execute(command);

      sendResponseJson(res, StatusCodes.OK, "Successfully created user", true, user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const dto = req.body as UserDto;
      const command = new UpdateUserCommand(id, dto);

      const userDetails = await this.updateUserHandler.execute(command);

      const transformedUser = {
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
        role: userDetails.role,
        phone: userDetails.phone,
        isVerified: userDetails.isVerified,
        isAdmin: userDetails.isAdmin,
        isBlocked: userDetails.isBlocked,
        googleId: userDetails.googleId,
        isFarmer: userDetails.isFarmer,
        farmerProfile: userDetails.farmerProfile,
        profilePhoto: userDetails.profilePhoto,
        bio: userDetails.bio,
        courseProgress: userDetails.courseProgress,
        reason: userDetails.reason,
        courseCertificate: userDetails.courseCertificate,
      };

      sendResponseJson(res, StatusCodes.OK, "Successfully updated all user", true, transformedUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { isBlocked } = req.body;

      const command = new BlockUserCommand(id, isBlocked);

      console.log("this is in the backend block user", id, isBlocked, command);
      const user = await this.blockUserHandler.execute(command);
      sendResponseJson(res, StatusCodes.OK, "Successfully blocked user", true, user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      sendResponseJson(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false);
    }
  }
}
