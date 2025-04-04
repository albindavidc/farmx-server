import { Otp } from "../../entities/Otp.entity";

export interface OTPRepository {
  create(otp: Otp): Promise<Otp>;
  findByUserId(userId: string): Promise<Otp | null>;
  invalidateAllForUser(userId: string): Promise<void>;
  markAsUsed(id: string): Promise<void>;
  deleteByEmail(email: string): Promise<void>;
}
