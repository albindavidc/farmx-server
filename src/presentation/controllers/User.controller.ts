import { inject, injectable } from "inversify";
import { SettingsUseCase } from "../../application/use-cases/use-cases/Settings.use-case";
import { TYPES } from "../container/types";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";
import { UploadProfilePhotoCommand } from "../../application/use-cases/commands/upload-profile-photo.command";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { UserRepository } from "../../domain/interfaces/repositories/user.repository";
import { ChangePasswordCommand } from "../../application/use-cases/commands/change-password.command";
import { ChangePasswordHandler } from "../../application/use-cases/handlers/change-password.handler";
import { LoginChangePasswordHandler } from "../../application/use-cases/handlers/login-change-password.handler";
import { LoginChangePasswordCommand } from "../../application/use-cases/commands/login-change-password.command";
import { UserDto } from "../../application/use-cases/dto/User.dto";
import { UpdateUserHandler } from "../../application/use-cases/handlers/user/update-user.handler";
import { BlockUserHandler } from "../../application/use-cases/handlers/user/block-user.handler";
import { UpdateUserCommand } from "../../application/use-cases/commands/user/update-user.command";
import { BlockUserCommand } from "../../application/use-cases/commands/user/block-user.command";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.SettingsUseCase) private readonly settingsUseCase: SettingsUseCase,
    @inject(TYPES.UserRepository) private readonly userRepo: UserRepository,
    @inject(TYPES.ChangePasswordHandler) private changePasswordHandler: ChangePasswordHandler,
    @inject(TYPES.LoginChangePasswordHandler)
    private loginChangePasswordHandler: LoginChangePasswordHandler,
    @inject(TYPES.UpdateUserHandler) private updateUserHandler: UpdateUserHandler,
    @inject(TYPES.BlockUserHandler) private blockUserHandler: BlockUserHandler
  ) {}

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
      await this.changePasswordHandler.execute(command);
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

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userRepo.findAll();

      const transformedUsers = users.map((user) => {
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked,
          googleId: user.googleId,

          isFarmer: user.isFarmer,
          farmerStatus: user.farmerStatus,
          farmerRegId: user.farmerRegId,
          experience: user.experience,
          qualification: user.qualification,
          expertise: user.expertise,
          awards: user.awards,
          profilePhoto: user.profilePhoto,
          bio: user.bio,
          courseProgress: user.courseProgress,
          reason: user.reason,
          courseCertificate: user.courseCertificate,
        };
      });

      sendResponseJson(res, StatusCodes.OK, "Successfully got all users", true, transformedUsers);
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

      const user = await this.updateUserHandler.execute(command);

      sendResponseJson(res, StatusCodes.OK, "Successfully updated all user", true, user);
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
