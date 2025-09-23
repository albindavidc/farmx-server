import { CreateUserCommand } from "@application/commands/user/create-user.command";
import { UserDto } from "@application/dto/User.dto";
import { User } from "@domain/entities/user.entity";
import { UserRepository } from "@domain/repositories/user.repository";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";

@injectable()
export class CreateUserHandler {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserDto> {
    const { dto } = command;

    if (!dto.name || !dto.email || !dto.password || !dto.role || !dto.phone) {
      throw new Error(
        "Missing required fields: Name, Email, Password, Role, and Phone are required."
      );
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new Error(`User with email ${dto.email} already exists`);
    }
    const userData = new User(
      dto.name,
      dto.email,
      dto.password,
      dto.role,
      dto.phone,
      undefined,
      dto.isVerified ?? false,
      dto.isAdmin ?? false,
      dto.isBlocked ?? false,
      dto.googleId,
      dto.isFarmer ?? false,
      dto.farmerStatus,
      dto.farmerRegId,
      dto.experience,
      dto.qualification,
      dto.expertise,
      dto.awards,
      dto.profilePhoto,
      dto.bio,
      dto.courseProgress,
      dto.reason,
      dto.courseCertificate
    );

    const createdUser = await this.userRepository.create(userData);
    return {
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      password: createdUser.password,
      role: createdUser.role,
      phone: createdUser.phone,
      isVerified: createdUser.isVerified,
      isAdmin: createdUser.isAdmin,
      isBlocked: createdUser.isBlocked,
      googleId: createdUser.googleId,
      isFarmer: createdUser.isFarmer,
      farmerStatus: createdUser.farmerStatus,
      farmerRegId: createdUser.farmerRegId,
      experience: createdUser.experience,
      qualification: createdUser.qualification,
      expertise: createdUser.expertise,
      awards: createdUser.awards,
      profilePhoto: createdUser.profilePhoto,
      bio: createdUser.bio,
      courseProgress: createdUser.courseProgress,
      reason: createdUser.reason,
      courseCertificate: createdUser.courseCertificate,
    };
  }
}
