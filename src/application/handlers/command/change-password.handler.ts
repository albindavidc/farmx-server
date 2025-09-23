import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { ChangePasswordCommand } from "@application/commands/change-password.command";
import { AuthChangePasswordHandler } from "@application/handlers/command/auth/auth-change-password.handler";

@injectable()
export class ChangePasswordHandler {
  constructor(@inject(TYPES.ChangePasswordUseCase) private useCase: AuthChangePasswordHandler) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    await this.useCase.changePassword(command.userId, command.newPassword, command.confirmPassword);
  }
}
