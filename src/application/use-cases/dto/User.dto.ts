import { FarmerStatus } from "../../../domain/enums/FarmerStatus.enum";
import { CourseProgress } from "../../../infrastructure/database/schemas/UserSchema";

// user.dto.ts
export interface UserDto {
  _id?: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isVerified: boolean;
  isAdmin?: boolean;
  isBlocked?: boolean;
  googleId?: string;

  isFarmer?: boolean;
  farmerRegId?: string;
  experience?: number;
  qualification?: string;
  expertise?: string[];
  awards?: string[];
  farmerStatus?: FarmerStatus;
  profilePhoto?: string;
  bio?: string;
  courseProgress?: CourseProgress[];
  reason?: string;
}

export interface SignupRequestDto {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}
