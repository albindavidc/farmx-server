import { CreateUserDto } from "../../dto/User.dto";

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}
