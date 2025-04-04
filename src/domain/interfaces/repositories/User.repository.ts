import { User } from "../../entities/User.entity";
import { Email } from "../../value-objects/Email.vo";

export interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByFirebaseUid(uid: string): Promise<User | null>;
  update(user: Partial<User>): Promise<User>;
}
