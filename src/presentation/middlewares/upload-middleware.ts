import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ImageUploadService } from "../../infrastructure/services/image-upload.service";
import { TYPES } from "../container/types";

@injectable()
export class UploadMiddleware {
  constructor(@inject(TYPES.ImageuploadService) private imageUploadService: ImageUploadService) {}

  handle() {
    return (req: Request, res: Response, next: NextFunction) => {
      const upload = this.imageUploadService.getCommunityImageMiddleware();
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Image upload failed",
            error: err.message,
          });
        }
        next();
      });
    };
  }
}
