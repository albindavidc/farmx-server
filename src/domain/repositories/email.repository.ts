export interface EmailRepository {
  sendOtpEmail(email: string, otp: string): Promise<void>;
}
