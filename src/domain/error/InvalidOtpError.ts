export class InvalidOtpError extends Error {
  constructor() {
    super("Otp is invalid or expired");
  }
}
