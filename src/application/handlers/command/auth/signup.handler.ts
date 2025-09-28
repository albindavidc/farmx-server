import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { SignupRequestDto, UserDto } from "@application/dtos/user.dto.js";
import { UserExistsException } from "@application/exceptions/user-exists.exception.js";
import { ISignUp } from "@application/interfaces/command/auth/signup.interface.js";
import { UserMapper } from "@application/mappers/user.mapper.js";
import { User } from "@domain/entities/user.entity.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { EmailVO } from "@domain/value-objects/user/email.vo.js";
import { NameVO } from "@domain/value-objects/user/name.vo.js";
import { PasswordVO } from "@domain/value-objects/user/password.vo.js";
import { PhoneNumberVO } from "@domain/value-objects/user/phone-number.vo.js";
import { RoleVO } from "@domain/value-objects/user/role.vo.js";

@injectable()
export class CreateUserHandler implements ISignUp {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async execute(dto: SignupRequestDto): Promise<UserDto> {
    const userEntity = await UserMapper.toEntity(dto);

    const existingUser = await this.userRepository.findByEmail(userEntity.email);
    if (existingUser) {
      throw new UserExistsException(dto.email);
    }
    const timestamp = {
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const name = NameVO.create(userEntity.name);
    const email = EmailVO.create(userEntity.email);
    const hashedPassword = await PasswordVO.hash(userEntity.hashedPassword);
    const role = RoleVO.create(userEntity.role);
    const phone = PhoneNumberVO.create(userEntity.phone);

    const newUser = new User(name, email, hashedPassword, role, phone, timestamp);
    const createdUser = await this.userRepository.create(newUser);
    return UserMapper.toDto(createdUser) as UserDto;
  }
}
