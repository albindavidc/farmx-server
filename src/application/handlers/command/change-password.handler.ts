import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { ChangePasswordCommand } from "@application/commands/change-password.command";
import { AuthChangePasswordHandler } from "@application/handlers/command/auth/auth-change-password.handler";
import { IChangePassword } from "@application/interfaces/command/change-password.interface";

@injectable()
export class ChangePasswordHandler implements IChangePassword {
  constructor(@inject(TYPES.ChangePasswordUseCase) private useCase: AuthChangePasswordHandler) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    await this.useCase.changePassword(command.userId, command.newPassword, command.confirmPassword);
  }
}
