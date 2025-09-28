// import { inject, injectable } from "inversify";

// import { TYPES } from "@presentation/container/types.js";
// import { ChangePasswordCommand } from "@application/commands/change-password.command.js";
// import { AuthChangePasswordHandler } from "@application/handlers/command/auth/auth-change-password.handler.js";
// import { IChangePassword } from "@application/interfaces/command/change-password.interface.js";

// @injectable()
// export class ChangePasswordHandler implements IChangePassword {
//   constructor(
//     @inject(TYPES.AuthChangePasswordHandler) private useCase: AuthChangePasswordHandler
//   ) {}

//   async execute(command: ChangePasswordCommand): Promise<void> {
//     await this.useCase.changePassword(command.userId, command.newPassword, command.confirmPassword);
//   }
// }
