import { UserDocument } from "../infrastructure/database/schemas/user.schema";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;

      file?: Express.Multer.File;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

export {};
