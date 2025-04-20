import { User } from "../../../domain/entities/User.entity";
import { UserDto } from "../dto/User.dto";

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      googleId: user.googleId,

      isFarmer: user.isFarmer,
      farmerRegId: user.farmerRegId,
      experience: user.experience,
      qualification: user.qualification,
      expertise: user.expertise,
      awards: user.awards,
      farmerStatus: user.farmerStatus,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
      courseProgress: user.courseProgress,
      reason: user.reason,
    };
  }

  static toEntity(dto: Partial<UserDto>): User {
    return new User(
      dto.name ?? "",
      dto.email ?? "",
      "",
      dto.role ?? "",
      dto.phone ?? "",
      dto._id,
      dto.isVerified ?? false,
      dto.isAdmin ?? false,
      dto.isBlocked ?? false,
      dto.googleId,
      dto.isFarmer ?? false,
      dto.farmerRegId,
      dto.experience,
      dto.qualification,
      dto.expertise,
      dto.awards,
      dto.farmerStatus,
      dto.profilePhoto,
      dto.bio,
      dto.courseProgress,
      dto.reason
    );
  }

  static updateEntityFromDto(entity: User, dto: Partial<UserDto>): User {
    return new User(
      dto.name ?? entity.name,
      dto.email ?? entity.email,
      entity.password,
      dto.role ?? entity.role,
      dto.phone ?? entity.phone,
      entity._id,
      dto.isVerified ?? entity.isVerified,
      dto.isAdmin ?? entity.isAdmin,
      dto.isBlocked ?? entity.isBlocked,
      dto.googleId ?? entity.googleId,

      dto.isFarmer ?? entity.isFarmer,
      dto.farmerRegId ?? entity.farmerRegId,
      dto.experience ?? entity.experience,
      dto.qualification ?? entity.qualification,
      dto.expertise ?? entity.expertise,
      dto.awards ?? entity.awards,
      dto.farmerStatus ?? entity.farmerStatus,
      dto.profilePhoto ?? entity.profilePhoto,
      dto.bio ?? entity.bio,
      dto.courseProgress ?? entity.courseProgress,
      dto.reason ?? entity.reason
    );
  }
}
