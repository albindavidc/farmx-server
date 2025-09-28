import { BlockUserCommand } from "@application/commands/user/block-user.command.js";
import { User } from "@domain/entities/user.entity.js";

export interface IBlockUser {
  execute(command: BlockUserCommand): Promise<User | null>;
}
