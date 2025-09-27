import { IUserDocument } from "@infrastructure/database/schemas/user.schema";
import { ILoginAttempts } from "@infrastructure/services/auth/redis-auth.service";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;

      file?: Express.Multer.File;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };

      loginAttempts?: ILoginAttempts;
    }
  }
}

export {};
