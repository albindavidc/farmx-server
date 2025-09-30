import { UserDto } from "@application/dtos/user.dto.js";

export class VerifyOtpCommand {
  constructor(public readonly dto: Partial<UserDto>) {}
}
