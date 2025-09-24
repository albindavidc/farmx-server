import { UserNotFoundException } from "@application/exceptions/user-not-found.exception";
import { UserMapper } from "@application/mappers/user.mapper";
import { UserDto } from "@application/dtos/user.dto";
import { IGetUser } from "@application/interfaces/query/user/get-user.interface";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";

export class GetUserQueryHandler implements IGetUser {
  constructor(private userRepository: IUserRepository) {}

  public async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return UserMapper.toDto(user);
  }
}
