export interface EmailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
}
