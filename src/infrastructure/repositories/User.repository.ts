import { UserDto } from "@application/dtos/user.dto";
import { User } from "@domain/entities/user.entity";
import { EmailVO } from "@domain/value-objects/user/email.vo";
import UserSchema from "@infrastructure/database/schemas/user.schema";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { UserMapper } from "@application/mappers/user.mapper";
import { PasswordVO } from "../../domain/value-objects/user/password.vo";

export class UserRepositoryImpl implements IUserRepository {
  async create(user: User): Promise<User> {
    const userDoc = new UserSchema(user);
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

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const userDoc = await UserSchema.findByIdAndUpdate(id, user, {
      new: true,
    }).exec();
    return userDoc ? UserMapper.fromPersistence(userDoc) : null;
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
    return user.verifyPassword(oldPassword);
  }
}
