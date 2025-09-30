import { EmailVO } from "@domain/value-objects/user/email.vo.js";
import { User } from "@domain/entities/user.entity";

export interface IFindUsersOptions {
  skip?: number; //users to skip in the previous pages
  take?: number; //users to limit for the next page

  where?: Record<string, unknown>; //filter(search) - narrow down using custom conditions (eg: {role: 'admin'})
  order?: Record<string, "ASC" | "DESC">; //sorting

  // search?: string; //search term
}

export interface IUserRepository {
  findAndCount(options: IFindUsersOptions): Promise<[User[], number]>;

  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findByEmail(email: EmailVO | string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User>;

  googleAuthLogin(userData: User): Promise<{ user: User; isNewUser: boolean }>;
  setRole(userId: string, role: string): Promise<User | null>;

  getProfilePhotoPath(userId: string | number): Promise<string | null>;

  validatePassword(id: string, oldPassword: string): Promise<boolean>;
  updatePassword(id: string, newPasswordHash: string): Promise<User | null>;
}
