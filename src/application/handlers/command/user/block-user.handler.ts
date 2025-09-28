import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { BlockUserCommand } from "@application/commands/user/block-user.command.js";
import { IBlockUser } from "@application/interfaces/command/user/block-user.interface.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { User } from "@domain/entities/user.entity.js";

@injectable()
export class BlockUserHandler implements IBlockUser {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(command: BlockUserCommand): Promise<User | null> {
    return this.userRepository.update(command.id, { isBlocked: command.isBlocked });
  }
}
