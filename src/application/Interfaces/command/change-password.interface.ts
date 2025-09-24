import { ChangePasswordCommand } from "@application/commands/change-password.command";

export interface IChangePassword {
  execute(command: ChangePasswordCommand): Promise<void>;
}
