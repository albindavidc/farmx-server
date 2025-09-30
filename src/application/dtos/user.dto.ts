import { FarmerStatus } from "@domain/enums/farmer-status.enum.js";
import { ICourseProgress, IUserCertificate } from "@infrastructure/database/schemas/user.schema.js";

export interface UserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  _id?: string;
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
  timestamps?: {
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export type SignupRequestDto = Pick<UserDto, "name" | "email" | "password" | "role" | "phone">;
export type UpdateUserDto = Partial<UserDto>;

export interface PaginatedUsersResultDto {
  items: Partial<UserDto>[];

  totalItems: number;
  totalPages: number;

  currentPage: number;
  pageSize: number; // number of items per page
}
