import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception.js";
import { IAuthChangePassword } from "@application/interfaces/command/auth/auth-change-password.interface.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";

@injectable()
export class AuthChangePasswordHandler implements IAuthChangePassword {
  constructor(@inject(TYPES.UserRepository) private userRepo: IUserRepository) {}

  async changePassword(
    userId: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundException("User not found");
    }

    if (newPassword !== confirmPassword) throw new Error("Password do not match");
    // const newPasswordObj = await Password.hash(newPassword);
    // user.password = newPasswordObj;
    user.hashedPassword = newPassword;
    await this.userRepo.update(userId, user);
  }
}
