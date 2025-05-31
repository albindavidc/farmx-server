import { inject, injectable } from "inversify";
import { UserRepository } from "../../../../domain/interfaces/repositories/user.repository";
import { TYPES } from "../../../../presentation/container/types";
import { BlockUserCommand } from "../../commands/user/block-user.command";
import { UserDto } from "../../dto/User.dto";

@injectable()
export class BlockUserHandler {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(command: BlockUserCommand): Promise<UserDto | null> {
    return this.userRepository.update(command.id, { isBlocked: command.isBlocked });
  }
}
