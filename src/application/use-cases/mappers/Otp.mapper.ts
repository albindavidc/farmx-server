import { Otp } from "../../../domain/entities/Otp.entity";
import { OtpResponseDto } from "../dto/Otp.dto";

export class OtpMapper {
  static toDto(otp: Otp | null, isVerified: boolean): OtpResponseDto {
    if (!otp) {
      return {
        email: "",
        otp: undefined,
        isVerified,
        expiresAt: undefined,
      };
    }

    return {
      email: otp.email,
      otp: otp.otp,
      isVerified,
      expiresAt: otp.expiresAt,
    };
  }
}
