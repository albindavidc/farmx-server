export interface OtpRequestDto {
  email: string;
  otp?: string;
}

export interface OtpResponseDto {
  otp?: string;
  isVerified: boolean;
}
