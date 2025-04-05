import { User } from "../../../domain/entities/User.entity";
import { UserRole } from "../../../domain/enums/UserRole.enum";
import { UserRepository } from "../../../domain/interfaces/repositories/User.repository";
import { Email } from "../../../domain/value-objects/Email.vo";
import { SignupRequestDto, UserDto } from "../dto/User.dto";
import { UserExistsException } from "../exceptions/UserExists.exception";
import { UserMapper } from "../mappers/User.mapper";

export class CreateUserCommand {
  constructor(public userRepository: UserRepository) {}

  public async execute(dto: SignupRequestDto): Promise<UserDto> {
    const email = Email.create(dto.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserExistsException(dto.email);
    }

    const role = dto.role
      ? UserRole[dto.role as keyof typeof UserRole] || UserRole.USER
      : UserRole.USER;
    const newUser = new User(dto.name, dto.email, dto.password, role);
    const createdUser = await this.userRepository.create(newUser);
    return UserMapper.toDto(createdUser);
  }
}
