import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { UserDto } from "@application/dtos/user.dto.js";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception.js";
import { IGetUser } from "@application/interfaces/query/user/get-user.interface.js";
import { UserMapper } from "@application/mappers/user.mapper.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";

@injectable()
export class GetUserQueryHandler implements IGetUser {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async execute(id: string): Promise<Partial<UserDto>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return UserMapper.toDto(user);
  }
}
