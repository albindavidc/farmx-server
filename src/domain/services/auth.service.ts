import { User } from "../entities/user.entity";
import { OTP } from "../entities/otp.entity";
import { UserRepository } from "../repositories/user.repository";
import { OTPRepository } from "../repositories/otp.repositories";

import { Email } from "../value-objects/email.vo";
import { Password } from "../value-objects/password.vo";
import { UserRole } from "../enums/user-role.enum";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OTPRepository
  ) {}

  async registerWithEmail(user: {
    name: string;
    email: Email;
    phone: string;
    password: Password;
  }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const newUser = User.create({
      ...user,
      role: [UserRole.USER],
    });

    return this.userRepository.create(newUser);
  }

  async registerWithFirebase(firebaseUid: string, email: Email): Promise<User> {
    const existingUser = await this.userRepository.findByFirebaseUid(
      firebaseUid
    );
    if (existingUser) {
      return existingUser;
    }

    const newUser = User.create({
      name: email.toString().split("@")[0],
      email,
      phone: "",
      password: Password.create("firebase-authenticated"),
      firebaseUid,
    });

    return this.userRepository.create(newUser);
  }

  async verifyOTP(userId: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findByUserId(userId);
    if (!otp || otp.isUsed || otp.isExpired()) {
      return false;
    }

    if (otp.code !== code) {
      return false;
    }

    await this.otpRepository.markAsUsed(otp.id);
    return true;
  }
}
