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

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.SettingsUseCase) private readonly settingsUseCase: SettingsUseCase,
    @inject(TYPES.UserRepository) private readonly userRepo: UserRepository,
    @inject(TYPES.ChangePasswordHandler) private changePasswordHandler: ChangePasswordHandler,
    @inject(TYPES.LoginChangePasswordHandler)
    private loginChangePasswordHandler: LoginChangePasswordHandler
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
}
