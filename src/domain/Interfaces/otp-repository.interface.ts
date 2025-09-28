import { Otp } from "@domain/entities/otp.entity";

export interface IOTPRepository {
  create(otp: Otp): Promise<Otp>;

  findByEmail(email: string): Promise<Otp | null>;
  deleteByEmail(email: string): Promise<void>;
}
