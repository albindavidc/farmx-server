import { BlockUserCommand } from "@application/commands/user/block-user.command";
import { UserDto } from "@application/dto/User.dto";
import { UserRepository } from "@domain/repositories/user.repository";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";

@injectable()
export class BlockUserHandler {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(command: BlockUserCommand): Promise<UserDto | null> {
    return this.userRepository.update(command.id, { isBlocked: command.isBlocked });
  }
}
