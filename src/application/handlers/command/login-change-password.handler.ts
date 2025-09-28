import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { ILoginChangePassword } from "@application/interfaces/command/login-change-password.interface.js";
import { User } from "@domain/entities/user.entity.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";

@injectable()
export class LoginChangePasswordHandler implements ILoginChangePassword {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(command: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<User | null> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new Error("The user not found");
    }

    if (command.newPassword !== command.confirmPassword)
      throw new Error("The password do not match");

    user.hashedPassword = command.newPassword;

    if (!user.id) {
      throw new Error("The user is not found");
    }
    return this.userRepository.update(user.id, user);
  }
}
