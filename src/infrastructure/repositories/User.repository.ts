import { UserDto } from "../../application/use-cases/dto/User.dto";
import { User } from "../../domain/entities/User.entity";
import { FarmerStatus } from "../../domain/enums/FarmerStatus.enum";
import { UserRole } from "../../domain/enums/UserRole.enum";
import { UserRepository } from "../../domain/interfaces/repositories/User.repository";
import { Email } from "../../domain/value-objects/Email.vo";
import UserSchema, { UserDocument } from "../database/schemas/UserSchema";

export class UserRepositoryImpl implements UserRepository {
  private mapToEntity(userDoc: UserDocument): User {
    return new User(
      userDoc.name,
      userDoc.email,
      userDoc.password,
      (userDoc.role as UserRole) ?? UserRole.USER,
      userDoc.phone,
      userDoc._id.toString(),
      userDoc.isVerified,
      userDoc.isAdmin,
      userDoc.isBlocked,
      userDoc.googleId,

      userDoc.isFarmer,
      userDoc.farmerRegId,
      userDoc.experience,
      userDoc.qualification,
      userDoc.expertise,
      userDoc.awards,
      userDoc.farmerStatus as FarmerStatus,
      userDoc.profilePhoto,
      userDoc.bio,
      userDoc.courseProgress ?? [],
      userDoc.reason
    );
  }

  async create(user: User): Promise<User> {
    const userDoc = new UserSchema(user);
    await userDoc.save();
    return this.mapToEntity(userDoc);
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
}
