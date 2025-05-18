import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { NextFunction } from "express";
import { ImageUploadService } from "../../application/services/image-upload.service";
import { Request, Response } from "express";

@injectable()
export class CommunityImageUploadMiddleware {
  constructor(@inject(TYPES.ImageuploadService) private imageUploadService: ImageUploadService) {}

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
