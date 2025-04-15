import { UserDocument } from "../infrastructure/database/schemas/UserSchema";

declare global {
    namespace Express {
      interface Request {
        user?: UserDocument;
      }
    }
  }
  
  export {}; // Ensure this is a module