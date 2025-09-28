import { OtpRequestDto, OtpResponseDto } from "@application/dtos/otp.dto.js";

export interface IGenerateOtp {
  execute(dto: OtpRequestDto): Promise<OtpResponseDto>;
}
