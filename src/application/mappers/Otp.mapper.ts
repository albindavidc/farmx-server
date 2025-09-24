import { OtpResponseDto } from "@application/dtos/otp.dto";
import { Otp } from "@domain/entities/otp.entity";

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
