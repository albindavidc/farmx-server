import { UserRepository } from "../../../domain/interfaces/repositories/User.repository";
import { UserNotFoundException } from "../exceptions/UserNotFound.exception";
import { UserDto } from "../dto/User.dto";
import { UserMapper } from "../mappers/User.mapper";

export class GetUserQuery {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return UserMapper.toDto(user);
  }
}
