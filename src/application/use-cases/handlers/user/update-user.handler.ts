import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/container/types";
import { UserRepository } from "../../../../domain/interfaces/repositories/user.repository";
import { UpdateUserCommand } from "../../commands/user/update-user.command";
import { UserDto } from "../../dto/User.dto";

@injectable()
export class UpdateUserHandler {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UserDto> {
    const { id, dto } = command;

    const update = {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      isBlocked: dto.isBlocked,
    };

    const updaedUser = await this.userRepository.update(id, update);
    if (!updaedUser) {
      throw new Error(`User with id ${id} not found on the DB`);
    }

    return {
      name: updaedUser.name,
      email: updaedUser.email,
      role: updaedUser.role,
      phone: updaedUser.phone,
      isVerified: updaedUser.isVerified,
      isBlocked: updaedUser.isBlocked,
    };
  }
}
