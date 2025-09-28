import { UserDto } from "@application/dtos/user.dto.js";
import { FarmerProfile, User } from "@domain/entities/user.entity.js";
import { FarmerStatus } from "@domain/enums/farmer-status.enum.js";
import { EmailVO } from "@domain/value-objects/user/email.vo.js";
import { NameVO } from "@domain/value-objects/user/name.vo.js";
import { PhoneNumberVO } from "@domain/value-objects/user/phone-number.vo.js";
import { RoleVO } from "@domain/value-objects/user/role.vo.js";
import {
  ICourseProgress,
  IUserCertificate,
  IUserDocument,
} from "@infrastructure/database/schemas/user.schema.js";

export interface IPersistenceData {
  name: string;
  email: string;
  hashedPassword: string;
  role: string;
  phone: string;
  timestamps: { createdAt: Date; updatedAt: Date };
  _id?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  isBlocked?: boolean;
  googleId?: string;

  isFarmer?: boolean;
  farmerProfile?: FarmerProfile;
  profilePhoto?: string;
  bio?: string;
  courseProgress?: ICourseProgress[];
  courseCertificate?: IUserCertificate[];
  reason?: string;
}

export class UserMapper {
  static toDto(user: User): Partial<UserDto> {
    return {
      name: user.name,
      email: user.email,
      // password: user.password, // Exclude password for security reasons
      role: user.role,
      phone: user.phone,
      _id: user.id,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      googleId: user.googleId,

      isFarmer: user.isFarmer,
      farmerProfile: user.farmerProfile,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
      courseProgress: user.courseProgress,
      reason: user.reason,
      timestamps: user.timestamps,
    };
  }

  static async toEntity(dto: Partial<UserDto>): Promise<User> {
    if (!dto.name || !dto.email || !dto.password || !dto.role || !dto.phone) {
      throw new Error(
        "Missing required fields: Name, Email, Password, Role, and Phone are required."
      );
    }

    const name = NameVO.create(dto.name);
    const email = EmailVO.create(dto.email);
    const role = RoleVO.create(dto.role);
    const phone = PhoneNumberVO.create(dto.phone);

    let farmerProfile: FarmerProfile | undefined;
    if (dto.isFarmer || dto.farmerProfile) {
      farmerProfile = new FarmerProfile(
        dto.farmerProfile?.farmerStatus,
        dto.farmerProfile?.farmerRegId,
        dto.farmerProfile?.experience,
        dto.farmerProfile?.qualification,
        dto.farmerProfile?.expertise,
        dto.farmerProfile?.awards
      );
    }

    if (dto._id) {
      return User.reconstitute({
        id: dto._id,
        name: name.value,
        email: email.value,
        hashedPassword: dto.password as string,
        role: role.value,
        phone: phone.value,
        isVerified: dto.isVerified ?? false,
        isAdmin: dto.isAdmin ?? false,
        isBlocked: dto.isBlocked ?? false,
        isFarmer: dto.isFarmer ?? false,
        farmerProfile: farmerProfile,
        profilePhoto: dto.profilePhoto,
        bio: dto.bio,
        courseProgress: dto.courseProgress,
        reason: dto.reason,
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
      });
    } else {
      if (!dto.password) {
        throw new Error("Password is required for new user");
      }

      return User.create({
        name: name.value,
        email: email.value,
        password: dto.password as string,
        role: role.value,
        phone: phone.value,
        isFarmer: dto.isFarmer ?? false,
        farmerProfile: farmerProfile,
      });
    }
  }

  static updateEntityFromDto(entity: User, dto: Partial<UserDto>): User {
    const updates: {
      name?: string;
      email?: string;
      phone?: string;
      role?: string;
      farmerProfile?: FarmerProfile;
      isFarmer?: boolean;
      isVerified?: boolean;
      isAdmin?: boolean;
      isBlocked?: boolean;
      googleId?: string;

      profilePhoto?: string;
      bio?: string;
      courseProgress?: ICourseProgress[];
      courseCertificate?: IUserCertificate[];
      reason?: string;
      timestamps?: { createdAt: Date; updatedAt: Date };
      id?: string;
    } = {};

    if (dto.name) updates.name = NameVO.create(dto.name).value;
    if (dto.email) updates.email = EmailVO.create(dto.email).value;
    if (dto.phone) updates.phone = PhoneNumberVO.create(dto.phone).value;
    if (dto.role) updates.role = RoleVO.create(dto.role).value;

    if (dto.farmerProfile || dto.isFarmer !== undefined) {
      updates.farmerProfile = new FarmerProfile(
        dto.farmerProfile?.farmerStatus ?? entity.farmerProfile?.farmerStatus,
        dto.farmerProfile?.farmerRegId ?? entity.farmerProfile?.farmerRegId,
        dto.farmerProfile?.experience ?? entity.farmerProfile?.experience,
        dto.farmerProfile?.qualification ?? entity.farmerProfile?.qualification,
        dto.farmerProfile?.expertise ?? entity.farmerProfile?.expertise,
        dto.farmerProfile?.awards ?? entity.farmerProfile?.awards
      );

      updates.isFarmer = dto.isFarmer ?? entity.isFarmer;
    }

    if (dto.profilePhoto !== undefined) updates.profilePhoto = dto.profilePhoto;
    if (dto.bio !== undefined) updates.bio = dto.bio;
    if (dto.courseProgress !== undefined) updates.courseProgress = dto.courseProgress;
    if (dto.reason !== undefined) updates.reason = dto.reason;
    if (dto.courseCertificate !== undefined) updates.courseCertificate = dto.courseCertificate;
    if (dto.isVerified !== undefined) updates.isVerified = dto.isVerified;
    if (dto.isAdmin !== undefined) updates.isAdmin = dto.isAdmin;
    if (dto.isBlocked !== undefined) updates.isBlocked = dto.isBlocked;
    if (dto.googleId !== undefined) updates.googleId = dto.googleId;

    return User.reconstitute({
      id: entity.id,
      name: updates.name ?? entity.name,
      email: updates.email ?? entity.email,
      hashedPassword: entity.hashedPassword,
      role: updates.role ?? entity.role,
      phone: updates.phone ?? entity.phone,
      isVerified: updates.isVerified ?? entity.isVerified,
      isAdmin: updates.isAdmin ?? entity.isAdmin,
      isBlocked: updates.isBlocked ?? entity.isBlocked,
      isFarmer: updates.isFarmer ?? entity.isFarmer,
      farmerProfile: updates.farmerProfile ?? entity.farmerProfile,
      profilePhoto: updates.profilePhoto ?? entity.profilePhoto,
      bio: updates.bio ?? entity.bio,
      courseProgress: updates.courseProgress ?? entity.courseProgress,
      reason: updates.reason ?? entity.reason,
      courseCertificate: updates.courseCertificate ?? entity.courseCertificate,
      timestamps: { createdAt: entity.timestamps.createdAt, updatedAt: new Date() },
    });
  }

  static fromPersistence(persistence: IUserDocument): User {
    return User.reconstitute({
      name: persistence.name,
      email: persistence.email,
      hashedPassword: persistence.hashedPassword,
      role: persistence.role,
      phone: persistence.phone,
      id: persistence._id.toString(),
      isVerified: persistence.isVerified,
      isAdmin: persistence.isAdmin,
      isBlocked: persistence.isBlocked,
      isFarmer: persistence.isFarmer,
      farmerProfile: persistence.farmerProfile
        ? new FarmerProfile(
            persistence.farmerProfile.farmerStatus as FarmerStatus,
            persistence.farmerProfile.farmerRegId,
            persistence.farmerProfile.experience,
            persistence.farmerProfile.qualification,
            persistence.farmerProfile.expertise,
            persistence.farmerProfile.awards
          )
        : undefined,
      profilePhoto: persistence.profilePhoto,
      bio: persistence.bio,
      courseProgress: persistence.courseProgress,
      reason: persistence.reason,
      courseCertificate: persistence.courseCertificate,
      timestamps: {
        createdAt: persistence.timestamps.createdAt,
        updatedAt: persistence.timestamps.updatedAt,
      },
      googleId: persistence.googleId,
    });
  }

  static toPersistence(user: User): IPersistenceData {
    return {
      name: user.name,
      email: user.email,
      hashedPassword: user.hashedPassword,
      role: user.role,
      phone: user.phone,
      timestamps: {
        createdAt: user.timestamps.createdAt,
        updatedAt: user.timestamps.updatedAt,
      },
      _id: user.id,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      isFarmer: user.isFarmer,
      farmerProfile: user.farmerProfile,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
      courseProgress: user.courseProgress || [],
      reason: user.reason,
      courseCertificate: user.courseCertificate || [],
      googleId: user.googleId,
    };
  }
}
