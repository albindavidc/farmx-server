import { injectable } from "inversify";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid4 } from "uuid";

@injectable()
export class ImageUploadService {
  private storage: multer.StorageEngine;
  private upload: multer.Multer;

  constructor() {
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueFileName = `${uuid4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
      },
    });

    this.upload = multer({
      storage: this.storage,
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only image files are allowed!"));
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    });
  }

  getUploadMiddleware() {
    return this.upload.single("image");
  }

  getImageUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}
