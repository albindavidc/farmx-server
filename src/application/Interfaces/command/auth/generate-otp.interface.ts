import { OtpRequestDto, OtpResponseDto } from "@application/dto/otp.dto";

export interface IGenerateOtp {
  execute(dto: OtpRequestDto): Promise<OtpResponseDto>;
}
