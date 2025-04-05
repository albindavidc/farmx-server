export interface EmailService {
  sentOtpEmail(email: string, otp: string): Promise<void>;
}
