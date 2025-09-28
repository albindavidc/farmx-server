import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { CreateUserCommand } from "@application/commands/user/create-user.command.js";
import { UserDto } from "@application/dtos/user.dto.js";
import { ICreateUser } from "@application/interfaces/command/user/create-user.interface.js";
import { UserMapper } from "@application/mappers/user.mapper.js";
import { User } from "@domain/entities/user.entity.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { EmailVO } from "@domain/value-objects/user/email.vo.js";
import { NameVO } from "@domain/value-objects/user/name.vo.js";
import { PasswordVO } from "@domain/value-objects/user/password.vo.js";
import { PhoneNumberVO } from "@domain/value-objects/user/phone-number.vo.js";
import { RoleVO } from "@domain/value-objects/user/role.vo.js";
import { UserIdVO } from "@domain/value-objects/user/user-id.vo.js";

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

    const userEntity = await UserMapper.toEntity(dto);

    const userData = new User(
      NameVO.create(userEntity.name),
      EmailVO.create(userEntity.email),
      PasswordVO.create(userEntity.hashedPassword),
      RoleVO.create(userEntity.role),
      PhoneNumberVO.create(userEntity.phone),
      userEntity.timestamps,
      UserIdVO.create(userEntity.id),

      userEntity.isVerified,
      userEntity.isAdmin,
      userEntity.isBlocked,
      userEntity.isFarmer,
      userEntity.courseCertificate,
      userEntity.courseProgress,
      userEntity.googleId,
      userEntity.farmerProfile,
      userEntity.profilePhoto,
      userEntity.bio,
      userEntity.reason
    );

    const createdUser = await this.userRepository.create(userData);
    return UserMapper.toDto(createdUser) as UserDto;
  }
}
