import { User } from "@domain/entities/user.entity.js";
export interface ILoginChangePassword {
  execute(command: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<User | null>;
}
