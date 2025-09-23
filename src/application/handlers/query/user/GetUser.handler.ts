import { UserRepository } from "@domain/repositories/user.repository";
import { UserNotFoundException } from "@application/exceptions/UserNotFound.exception";
import { UserDto } from "@application/dto/User.dto";
import { UserMapper } from "@application/mappers/User.mapper";

export class GetUserQueryHandler {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return UserMapper.toDto(user);
  }
}
