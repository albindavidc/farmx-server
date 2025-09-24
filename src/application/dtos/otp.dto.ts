export interface OtpRequestDto {
  email: string;
  otp?: string;
}

export interface OtpResponseDto {
  email: string;
  otp?: string;
  isVerified: boolean;
  expiresAt?: Date;
}
