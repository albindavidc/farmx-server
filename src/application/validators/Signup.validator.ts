import { SignupRequestDto } from "@application/dto/user.dto";

export class SignupValidator {
  public static validate(dto: SignupRequestDto): void {
    if (!dto.name || !dto.email || !dto.password) {
      throw new Error("Name, Email, and Password are required");
    }

    if (!dto.email.includes("@")) {
      throw new Error("Invalid email format");
    }
  }
}
