import { inject, injectable } from "inversify";
import { SettingsHandler } from "../../application/use-cases/commands-handler/Settings.handler";
import { TYPES } from "../container/Types";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";
import { UploadProfilePhotoCommand } from "../../application/use-cases/commands/UploadProfilePhoto.command";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

@injectable()
export class UserController {
  constructor(@inject(TYPES.SettingsHandler) private readonly settingsHandler: SettingsHandler) {}

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

      await this.settingsHandler.executeProfilePhotoUpdate(
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

      const filePath = await this.settingsHandler.executeGetProfilePhotoHandler(userId);
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
      const updatedUser = await this.settingsHandler.executeUpdateProfile(req.user?.id, {
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
}
