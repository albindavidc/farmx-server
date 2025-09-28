import { OtpRequestDto, OtpResponseDto } from "@application/dto/otp.dto.js";

export interface IVerifyOtp {
  execute(dto: OtpRequestDto): Promise<OtpResponseDto>;
}
