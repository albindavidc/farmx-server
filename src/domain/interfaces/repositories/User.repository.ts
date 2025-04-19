import { UserDto } from "../../../application/use-cases/dto/User.dto";
import { User } from "../../entities/User.entity";
import { Email } from "../../value-objects/Email.vo";

export interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User | null>;

  googleAuthLogin(userData: Partial<UserDto>): Promise<{ user: User; isNewUser: boolean }>;
  setRole(userId: string, role: string): Promise<User | null>;

  getProfilePhotoPath(userId: string | number): Promise<string | null>;
}
