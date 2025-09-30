import { injectable } from "inversify";

import { UserDto } from "@application/dtos/user.dto.js";
import { UserMapper } from "@application/mappers/user.mapper.js";
import { User } from "@domain/entities/user.entity.js";
import {
  IFindUsersOptions,
  IUserRepository,
} from "@domain/interfaces/user-repository.interface.js";
import { EmailVO } from "@domain/value-objects/user/email.vo.js";
import UserSchema from "@infrastructure/database/schemas/user.schema.js";
import { PasswordVO } from "@domain/value-objects/user/password.vo.js";

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  async findAndCount(options: IFindUsersOptions): Promise<[User[], number]> {
    const { where = {}, skip = 0, take = 10, order = {} } = options;

    const sort: Record<string, 1 | -1> = {};
    for (const [key, value] of Object.entries(order)) {
      sort[key] = value.toLowerCase() === "asc" ? 1 : -1;
    }

    const [userDocs, count] = await Promise.all([
      UserSchema.find(where).sort(sort).skip(skip).limit(take).lean().exec(),
      UserSchema.countDocuments(where).exec(),
    ]);

    const users = userDocs.map((userDoc) => UserMapper.fromPersistence(userDoc));
    return [users, count];
  }

  async create(user: User): Promise<User> {
    const userDoc = new UserSchema(UserMapper.toPersistence(user));
    await userDoc.save();
    return UserMapper.fromPersistence(userDoc);
  }

  async findAll(): Promise<User[]> {
    const userDocs = await UserSchema.find().exec();
    return userDocs.map((userDoc) => UserMapper.fromPersistence(userDoc));
  }

  async findByEmail(email: EmailVO): Promise<User | null> {
    const userDoc = await UserSchema.findOne({ email }).exec();
    return userDoc ? UserMapper.fromPersistence(userDoc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserSchema.findById(id).exec();
    return userDoc ? UserMapper.fromPersistence(userDoc) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user as User);
    const userDoc = await UserSchema.findByIdAndUpdate(id, persistenceData, {
      new: true,
    }).exec();

    if (!userDoc) throw new Error("User not found");

    return UserMapper.fromPersistence(userDoc);
  }

  async setRole(userId: string, role: string): Promise<User | null> {
    const userdoc = await UserSchema.findByIdAndUpdate(userId, { role }, { new: true });
    return userdoc ? UserMapper.fromPersistence(userdoc) : null;
  }

  async googleAuthLogin(userData: Partial<UserDto>): Promise<{ user: User; isNewUser: boolean }> {
    const { email, name, googleId, profilePhoto: picture } = userData;
    let userDoc = await UserSchema.findOne({ email }).exec();
    let isNewUser = false;

    if (!userDoc) {
      userDoc = new UserSchema({
        email,
        name,
        googleId,
        isVerified: true,
        profile: picture,
      });
      await userDoc?.save();
      isNewUser = true;
    }

    return { user: UserMapper.fromPersistence(userDoc), isNewUser };
  }

  async getProfilePhotoPath(userId: string | number): Promise<string | null> {
    const user = await UserSchema.findById(userId);
    return user?.profilePhoto || null;
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) throw new Error("User not found");
    const hashedPassword = await PasswordVO.hash(newPasswordHash);

    const updatedDoc = await UserSchema.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true, lean: true }
    ).exec();
    return updatedDoc ? UserMapper.fromPersistence(updatedDoc) : null;
  }

  async validatePassword(id: string, oldPassword: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    const verified = await PasswordVO.compare(oldPassword, user.hashedPassword);
    return verified;
  }
}
