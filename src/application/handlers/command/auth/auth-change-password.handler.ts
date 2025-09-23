import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/container/types";
import { UserRepository } from "@domain/repositories/user.repository";
import { UserNotFoundException } from "../../../exceptions/UserNotFound.exception";

@injectable()
export class AuthChangePasswordHandler {
  constructor(@inject(TYPES.UserRepository) private userRepo: UserRepository) {}

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
    user.password = newPassword;
    await this.userRepo.update(userId, user);
  }
}
