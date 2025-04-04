import { User } from "../../../../domain/entities/User.entity";
import { UserRepository } from "../../../../domain/interfaces/repositories/User.repository";
import { UserModel } from "../user.model";
import { Email } from "../../../../domain/value-objects/Email.vo";
import { Password } from "../../../../domain/value-objects/Password.vo";
import { UserRole } from "../../../../domain/enums/UserRole.enum";

export class MongoUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const newUser = new UserModel({
      id: user.id,
      name: user.name,
      email: user.email.toString(),
      phone: user.phone,
      password: user.password.toString(),
      roles: user.roles,
      isVerified: user.isVerified,
      firebaseUid: user.firebasedUid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    await newUser.save();
    return user;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await UserModel.findOne({
      email: email.toString(),
    }).exec();

    if (!user) return null;

    return User.create({
      name: user.name,
      email: Email.create(user.email),
      phone: user.phone,
      password: Password.create(user.password),
      role: [UserRole.USER],
      firebaseUid: user.firebaseUid,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).exec();

    if (!user) return null;

    return User.create({
      name: user.name,
      email: Email.create(user.email),
      phone: user.phone,
      password: Password.create(user.password),
      role: [UserRole.USER],
      firebaseUid: user.firebaseUid,
    });
  }

  async findByFirebaseUid(
    uid: string
  ): Promise<User | null> {
    const user = await UserModel.findOne({
      uid,
    }).exec();

    if (!user) return null;

    return User.create({
      name: user.name,
      email: Email.create(user.email),
      phone: user.phone,
      password: Password.create(user.password),
      role: user.roles.map(
        (role) => UserRole[role as keyof typeof UserRole]
      ),
      firebaseUid: user.firebaseUid,
    });
  }

  async update(user: User): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      {
        name: user.name,
        email: user.email.toString(),
        phone: user.phone,
        password: user.password.toString(),
        roles: user.roles,
        isVerified: user.isVerified,
        firebaseUid: user.firebasedUid,
        updatedAt: new Date(),
      },
      { new: true }
    ).exec();

    if (!updatedUser) throw new Error("User not found");

    return User.create({
      name: updatedUser.name,
      email: Email.create(updatedUser.email),
      phone: updatedUser.phone,
      password: Password.create(updatedUser.password),
      role: updatedUser.roles.map(
        (role) => UserRole[role as keyof typeof UserRole]
      ),
      firebaseUid: updatedUser.firebaseUid,
    });
  }
}
