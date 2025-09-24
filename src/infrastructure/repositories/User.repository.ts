import { UserDto } from "@application/dto/user.dto";
import { User } from "@domain/entities/user.entity";
import { FarmerStatus } from "@domain/enums/farmer-status.enum";
import { IUserRepository } from "@domain/repositories/user.repository";
import { Email } from "@domain/value-objects/email.vo";
import UserSchema, { UserDocument } from "@infrastructure/database/schemas/user.schema";

export class UserRepositoryImpl implements IUserRepository {
  private mapToEntity(userDoc: UserDocument): User {
    return new User(
      userDoc.name,
      userDoc.email,
      userDoc.password,
      userDoc.role,
      userDoc.phone,
      userDoc._id.toString(),
      userDoc.isVerified,
      userDoc.isAdmin,
      userDoc.isBlocked,
      userDoc.googleId,

      userDoc.isFarmer,
      userDoc.farmerStatus as FarmerStatus,
      userDoc.farmerRegId,
      userDoc.experience,
      userDoc.qualification,
      userDoc.expertise,
      userDoc.awards,
      userDoc.profilePhoto,
      userDoc.bio,
      userDoc.courseProgress ?? [],
      userDoc.reason,
      userDoc.courseCertificate ?? []
    );
  }

  async create(user: User): Promise<User> {
    const userDoc = new UserSchema(user);
    await userDoc.save();
    return this.mapToEntity(userDoc);
  }

  async findAll(): Promise<User[]> {
    return UserSchema.find();
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userDoc = await UserSchema.findOne({ email }).exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserSchema.findById(id).exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const userDoc = await UserSchema.findByIdAndUpdate(id, user, {
      new: true,
    }).exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async setRole(userId: string, role: string): Promise<User | null> {
    const userdoc = await UserSchema.findByIdAndUpdate(userId, { role }, { new: true });
    return userdoc ? this.mapToEntity(userdoc) : null;
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

    return { user: this.mapToEntity(userDoc), isNewUser };
  }

  async getProfilePhotoPath(userId: string | number): Promise<string | null> {
    const user = await UserSchema.findById(userId);
    return user?.profilePhoto || null;
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) throw new Error("User not found");
    user.password = newPasswordHash;

    const hashedPassword = await user.getHashedPassword();
    const updatedDoc = await UserSchema.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true, lean: true }
    ).exec();
    return updatedDoc ? this.mapToEntity(updatedDoc) : null;
  }

  async validatePassword(id: string, oldPassword: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    return user.verifyPassword(oldPassword);
  }
}
