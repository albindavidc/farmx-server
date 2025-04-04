import { UserRole } from "../../../../domain/enums/UserRole.enum";
import { FarmerStatus } from "../../../../domain/enums/FarmerStatus.enum";
import { CourseProgress } from "../../../../infrastructure/persistence/mongodb/user.model";

// user.dto.ts
export interface UserDto {
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  isAdmin?: boolean;
  isBlocked?: boolean;
  googleId?: string;

  isFarmer?: boolean;
  experience?: number;
  qualification?: string;
  expertise?: string[];
  tutorStatus?: FarmerStatus;
  profile?: string;
  bio?: string;
  courseProgress?: CourseProgress;
  reason?: string;
}

export interface SignupRequestDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}
