import {UserDto} from "@application/dtos/user.dto";

export class CreateUserCommand {
  constructor(public readonly dto: UserDto) {}
}
