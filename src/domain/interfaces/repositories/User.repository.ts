import { UserDto } from "../../../application/use-cases/dto/User.dto";
import { User } from "../../entities/user.entity";
import { Email } from "../../value-objects/Email.vo";

export interface UserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findByEmail(email: Email | string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User | null>;

  googleAuthLogin(userData: Partial<UserDto>): Promise<{ user: User; isNewUser: boolean }>;
  setRole(userId: string, role: string): Promise<User | null>;

  getProfilePhotoPath(userId: string | number): Promise<string | null>;

  validatePassword(id: string, oldPassword: string): Promise<boolean>;
  updatePassword(id: string, newPasswordHash: string): Promise<User | null>;
}
