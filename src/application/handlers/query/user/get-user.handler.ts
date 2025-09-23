import { UserDto } from "@application/dto/user.dto";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception";
import { UserMapper } from "@application/mappers/user.mapper";
import { UserRepository } from "@domain/repositories/user.repository";

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
