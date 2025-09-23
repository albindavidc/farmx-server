import { UserRepository } from "@domain/repositories/user.repository";
import { inject, injectable } from "inversify";
import { User } from "../../../../domain/entities/user.entity";
import { Email } from "../../../../domain/value-objects/email.vo";
import { TYPES } from "../../../../presentation/container/types";
import { SignupRequestDto, UserDto } from "../../../dto/user.dto";
import { UserExistsException } from "../../../exceptions/user-exists.exception";
import { UserMapper } from "../../../mappers/user.mapper";

@injectable()
export class CreateUserHandler {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

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
