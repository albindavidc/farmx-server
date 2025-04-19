import { inject, injectable } from "inversify";
import { TYPES } from "../../../presentation/container/Types";
import { ChangePasswordUseCase } from "../use-cases/ChangePassword.use-case";
import { ChangePasswordCommand } from "../commands/ChangePassword.command";

@injectable()
export class ChangePasswordHandler {
  constructor(@inject(TYPES.ChangePasswordUseCase) private useCase: ChangePasswordUseCase) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    await this.useCase.changePassword(
      command.userId,
      command.newPassword,
      command.confirmPassword
    );
  }
}
