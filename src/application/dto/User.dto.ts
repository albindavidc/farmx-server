import { FarmerStatus } from "../../domain/enums/farmer-status.enum";
import { Password } from "../../domain/value-objects/Password.vo";
import { CourseProgress, UserCertificate } from "../../infrastructure/database/schemas/user.schema";

export interface UserDto {
  _id?: string;
  name: string;
  email: string;
  password: string | Password;
  role: string;
  phone: string;
  isVerified: boolean;
  isAdmin?: boolean;
  isBlocked?: boolean;
  googleId?: string;

  isFarmer?: boolean;
  farmerStatus?: FarmerStatus;
  farmerRegId?: string;
  experience?: number;
  qualification?: string;
  expertise?: string[];
  awards?: string[];
  profilePhoto?: string;
  bio?: string;
  courseProgress?: CourseProgress[];
  reason?: string;
  courseCertificate?: UserCertificate[];
}

export type SignupRequestDto = Pick<UserDto, "name" | "email" | "password" | "role" | "phone">;
export type UpdateUserDto = Partial<UserDto>;
