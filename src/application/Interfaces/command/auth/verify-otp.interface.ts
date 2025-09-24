import { OtpResponseDto, OtpRequestDto } from "@application/dto/otp.dto";

export interface IVerifyOtp {
  execute(dto: OtpRequestDto): Promise<OtpResponseDto>;
}
