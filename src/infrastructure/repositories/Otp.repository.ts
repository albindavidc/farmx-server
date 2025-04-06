import { Otp } from "../../domain/entities/Otp.entity";
import { OTPRepository } from "../../domain/interfaces/repositories/Otp.repository";
import { OtpModel } from "../database/schemas/OtpSchema";

export class OtpRepositoryImpl implements OTPRepository {
  async create(otp: {
    email: string;
    otp: string;
    expiresAt: Date;
  }): Promise<Otp> {
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
