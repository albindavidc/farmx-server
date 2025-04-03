import { User } from "../entities/user.entity";
import { Email } from "../value-objects/email.vo";

export interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByFirebaseUid(uid: string): Promise<User | null>;
  update(user: User): Promise<User>;
}
