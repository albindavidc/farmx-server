import { User } from "../../entities/User.entity";
import { Email } from "../../value-objects/Email.vo";

export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  setRole(userId: string, role: string): Promise<User>;
  googleAuthLogin(
    userData: string
  ): Promise<{ user: User; isNewUser: boolean }>;
}
