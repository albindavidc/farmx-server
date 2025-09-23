import { UpdateUserDto } from "../../dto/User.dto";

export class UpdateUserCommand {
  constructor(public readonly id: string, public readonly dto: UpdateUserDto) {}
}
