export interface IEmailRepository {
  sendOtpEmail(email: string, otp: string): Promise<void>;
}
