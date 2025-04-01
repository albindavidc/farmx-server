import { OTP } from "../entities/otp.entity";

export interface OTPRepository {
  create(otp: OTP): Promise<OTP>;
  findByUserId(userId: string): Promise<OTP | null>;
  invalidateAllForUser(userId: string): Promise<void>;
  markAsUsed(id: string): Promise<void>;
}
