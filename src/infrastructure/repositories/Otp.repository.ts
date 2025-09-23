import { Otp } from "@domain/entities/otp.entity";
import { OTPRepository } from "@domain/repositories/otp.repository";
import { OtpModel } from "@infrastructure/database/schemas/otp.schema";

export class OtpRepositoryImpl implements OTPRepository {
  async create(otp: { email: string; otp: string; expiresAt: Date }): Promise<Otp> {
    const createdOtp = OtpModel.create(otp);
    return createdOtp;
  }

  async findByEmail(email: string): Promise<Otp | null> {
    return await OtpModel.findOne({ email }).exec();
  }

  async deleteByEmail(email: string): Promise<void> {
    await OtpModel.deleteOne({ email }).exec();
  }
}
