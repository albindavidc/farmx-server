import { OtpRequestDto } from "@application/dtos/otp.dto.js";

export class OtpValidator {
  public static validate(dto: OtpRequestDto): void {
    if (!dto.email) {
      throw new Error("Email is required");
    }

    if (dto.otp && dto.otp.length !== 6) {
      throw new Error("Otp must be 6 digits");
    }
  }
}
