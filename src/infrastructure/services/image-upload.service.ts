import { injectable } from "inversify";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

@injectable()
export class ImageUploadService {
  private createStorage(uploadDir: string) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
      },
    });
  }

  private createMulter(uploadDir: string) {
    return multer({
      storage: this.createStorage(uploadDir),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only image files are allowed!"));
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    });
  }

  /* Community Image Upload */
  getCommunityImageMiddleware(fieldName: string = "file") {
    const uploadDir = path.join(process.cwd(), "uploads/community-images");
    return this.createMulter(uploadDir).single(fieldName);
  }

  async uploadCategoryImages(req: Request): Promise<string> {
    if (!req.file) {
      throw new Error("No image file provided");
    }

    const baseUrl = process.env.PRODUCTION_URL
      ? process.env.PRODUCTION_URL
      : process.env.DEVELOPMENT_URL;

    const relativePath = `/uploads/community-images/${req.file.filename}`;

    return `${baseUrl}${relativePath}`;
  }

  /* Community Post Image*/
  getCommunityPostMiddleware(fieldName: string = "file", postId: string) {
    const uploadDir = path.join(process.cwd(), "uploads/community/community/post", postId);
    return this.createMulter(uploadDir).single(fieldName);
  }

  async uploadCommunityPostImages(req: Request, postId: string): Promise<string> {
    if (!req.file) {
      throw new Error("No image file was provided");
    }

    const baseUrl = process.env.PRODUCTION_URL
      ? process.env.PRODUCTION_URL
      : process.env.DEVELOPMENT_URL;

    const relativePath = `/uploads/community/community/post/${postId}/${req.file.filename}`;
    return `${baseUrl}${relativePath}`;
  }
}
