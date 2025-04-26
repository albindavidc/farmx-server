import { UserDocument } from "../infrastructure/database/schemas/user.schema";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;

      file?: Express.Multer.File;
      
    }
  }
}

export {}; // Ensure this is a module
