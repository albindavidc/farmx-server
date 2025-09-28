import { UserDto } from "@application/dtos/user.dto.js";

export class CreateUserCommand {
  constructor(public readonly dto: Partial<UserDto>) {}
}
