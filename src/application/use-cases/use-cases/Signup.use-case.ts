import { inject, injectable } from "inversify";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";
import { Email } from "../../../domain/value-objects/Email.vo";
import { SignupRequestDto, UserDto } from "../dto/User.dto";
import { UserExistsException } from "../exceptions/UserExists.exception";
import { UserMapper } from "../mappers/User.mapper";
import { TYPES } from "../../../presentation/container/types";

@injectable()
export class CreateUserUseCase {
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
