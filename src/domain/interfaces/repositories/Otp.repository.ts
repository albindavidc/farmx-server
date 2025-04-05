import { Otp } from "../../entities/Otp.entity";

export interface OTPRepository {
  // create(otp: Otp): Promise<Otp>;
  findByEmail(email: string): Promise<Otp>;
  create(otpData: {
    email: string;
    otp: string;
    expiresAt: Date;
  }): Promise<void>;
  deleteByEmail(email: string): Promise<void>;

  findByUserId(userId: string): Promise<Otp | null>;
  invalidateAllForUser(userId: string): Promise<void>;
  markAsUsed(id: string): Promise<void>;
}
