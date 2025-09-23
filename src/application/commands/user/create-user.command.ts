import { UserDto } from "../../dto/user.dto";

export class CreateUserCommand {
  constructor(public readonly dto: UserDto) {}
}
