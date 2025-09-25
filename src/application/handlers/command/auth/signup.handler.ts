import { SignupRequestDto, UserDto } from "@application/dtos/user.dto";
import { UserExistsException } from "@application/exceptions/user-exists.exception";
import { ISignUp } from "@application/interfaces/command/auth/signup.interface";
import { UserMapper } from "@application/mappers/user.mapper";
import { User } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { Email } from "@domain/value-objects/user/email.vo";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";

@injectable()
export class CreateUserHandler implements ISignUp {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async execute(dto: SignupRequestDto): Promise<UserDto> {
    const email = Email.create(dto.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserExistsException(dto.email);
    }

    const newUser = new User(dto.name, dto.email, dto.password, dto.role, dto.phone);

    const createdUser = await this.userRepository.create(newUser);
    return UserMapper.toDto(createdUser);
  }
}
