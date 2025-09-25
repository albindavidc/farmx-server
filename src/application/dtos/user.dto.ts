import { FarmerStatus } from "../../domain/enums/farmer-status.enum";
import {
  ICourseProgress,
  IUserCertificate,
} from "../../infrastructure/database/schemas/user.schema";
import { PasswordVO } from "@domain/value-objects/user/password.vo";

export interface UserDto {
  _id?: string;
  name: string;
  email: string;
  password: string | PasswordVO;
  role: string;
  phone: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  isBlocked?: boolean;
  googleId?: string;

  isFarmer?: boolean;
  farmerProfile?: {
    farmerStatus?: FarmerStatus;
    farmerRegId?: string;
    experience?: number;
    qualification?: string;
    expertise?: string[];
    awards?: string[];
  };
  profilePhoto?: string;
  bio?: string;
  courseProgress?: ICourseProgress[];
  reason?: string;
  courseCertificate?: IUserCertificate[];
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
}

export type SignupRequestDto = Pick<UserDto, "name" | "email" | "password" | "role" | "phone">;
export type UpdateUserDto = Partial<UserDto>;
