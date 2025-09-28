import { ChangePasswordCommand } from "@application/commands/change-password.command.js";

export interface IChangePassword {
  execute(command: ChangePasswordCommand): Promise<void>;
}
