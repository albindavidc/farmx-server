import { OtpRequestDto, OtpResponseDto } from "../dto/Otp.dto";

export interface OtpUseCase {
  generateOtp(dto: OtpRequestDto): Promise<OtpResponseDto>;
  verifyOtp(dto: OtpRequestDto): Promise<OtpResponseDto>;
}
