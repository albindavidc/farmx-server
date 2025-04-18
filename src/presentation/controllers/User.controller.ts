import { inject, injectable } from "inversify";
import { SettingsHandler } from "../../application/use-cases/commands-handler/Settings.handler";
import { TYPES } from "../container/Types";
import sendResponseJson from "../../application/utils/Message";
import { StatusCodes } from "http-status-codes";
import { UploadProfilePhotoCommand } from "../../application/use-cases/commands/UploadProfilePhoto.command";
import { Request, Response } from "express";

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

      console.log(`You have successfully uploaded the file tothe back-end`)
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
}
