import { inject, injectable } from "inversify";
import { TYPES } from "../../../presentation/container/types";
import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";

@injectable()
export class LoginChangePasswordHandler {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(command: { email: string; newPassword: string; confirmPassword: string }) {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new Error("The user not found");
    }

    if (command.newPassword !== command.confirmPassword)
      throw new Error("The password do not match");

    user.password = command.newPassword;

    if (!user._id) {
      throw new Error("The user is not found");
    }
    return this.userRepository.update(user._id, user);
  }
}
