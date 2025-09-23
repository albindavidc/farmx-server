import { Otp } from "../entities/otp.entity";

export interface OTPRepository {
  create(otp: Otp): Promise<Otp>;

  findByEmail(email: string): Promise<Otp | null>;
  deleteByEmail(email: string): Promise<void>;
}
