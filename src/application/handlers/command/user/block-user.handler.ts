import { BlockUserCommand } from "@application/commands/user/block-user.command";
import { UserDto } from "@application/dtos/user.dto";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { IBlockUser } from "@application/interfaces/command/user/block-user.interface";

@injectable()
export class BlockUserHandler implements IBlockUser {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(command: BlockUserCommand): Promise<UserDto | null> {
    return this.userRepository.update(command.id, { isBlocked: command.isBlocked });
  }
}
