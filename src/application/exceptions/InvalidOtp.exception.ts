export class InvalidOtpException extends Error {
  constructor() {
    super("Invalid or Expired Otp");
    this.name = "InvalidOtpException";
  }
}
