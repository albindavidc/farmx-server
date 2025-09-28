import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types.js";
import { ImageUploadService } from "@infrastructure/services/image-upload.service.js";

@injectable()
export class CommunityImageUploadMiddleware {
  constructor(@inject(TYPES.ImageUploadService) private imageUploadService: ImageUploadService) {}

  handle() {
    return (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      console.log("this is the postid from the middleware", postId);

      if (postId) {
        const upload = this.imageUploadService.getCommunityPostMiddleware("file", postId);
        upload(req, res, (err) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: "Image upload failed",
              error: err.message,
            });
          }
        });
      }

      next();
    };
  }
}
