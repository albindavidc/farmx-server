import { authenticator } from "otplib";

export class GenerateNewOtp {
  //Generate a new secret for a user
  public static generateSecret(): string {
    return authenticator.generateSecret(20);
  }

  //Generate a TOTP
  public static generateOtp(secret: string): string {
    authenticator.options = { digits: 6, step: 30 };
    return authenticator.generate(secret);
  }

  //Verify a TOTP
  public static verifyOtp(otp: string, secret: string): boolean {
    authenticator.options = { window: 1 };
    return authenticator.check(otp, secret);
  }
}
