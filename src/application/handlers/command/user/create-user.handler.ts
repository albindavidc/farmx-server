import { CreateUserCommand } from "@application/commands/user/create-user.command";
import { User } from "@domain/entities/user.entity";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";
import { UserDto } from "@application/dtos/user.dto";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { ICreateUser } from "@application/interfaces/command/user/create-user.interface";
import { UserMapper } from "@application/mappers/user.mapper";

@injectable()
export class CreateUserHandler implements ICreateUser {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

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
    return UserMapper.toDto(createdUser) as UserDto;
  }
}
