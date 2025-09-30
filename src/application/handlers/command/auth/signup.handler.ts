import { inject, injectable } from "inversify";

import { UserDto } from "@application/dtos/user.dto.js";
import { UserExistsException } from "@application/exceptions/user-exists.exception.js";
import { ISignUp } from "@application/interfaces/command/auth/signup.interface.js";
import { UserMapper } from "@application/mappers/user.mapper.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { TYPES } from "@presentation/container/types.js";
import { SignupUserCommand } from "@application/commands/auth/signup-user.command.js";

@injectable()
export class SignupHandler implements ISignUp {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async execute(command: SignupUserCommand): Promise<UserDto> {
    const { dto } = command;

    const userEntity = await UserMapper.toEntity(dto);

    console.log("this is from the handler", userEntity.hashedPassword);

    console.log("thisis the userentity", userEntity);
    console.log("==================================================");
    const existingUser = await this.userRepository.findByEmail(userEntity.email);
    if (existingUser && dto.email === existingUser.email) {
      throw new UserExistsException(dto.email);
    }


    const createdUser = await this.userRepository.create(userEntity);

    return UserMapper.toDto(createdUser) as UserDto;
  }
}
