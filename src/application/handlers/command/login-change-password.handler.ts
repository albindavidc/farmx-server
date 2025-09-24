import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { ILoginChangePassword } from "@application/interfaces/command/login-change-password.interface";
import { User } from "@domain/entities/user.entity";

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

    user.password = command.newPassword;

    if (!user._id) {
      throw new Error("The user is not found");
    }
    return this.userRepository.update(user._id, user);
  }
}
