import { UserDto } from "@application/dtos/user.dto.js";

export class SignupUserCommand {
  constructor(public readonly dto: Partial<UserDto>) {}
}
