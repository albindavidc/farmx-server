import { User } from "@domain/entities/user.entity";
export interface ILoginChangePassword {
  execute(command: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<User | null>;
}
