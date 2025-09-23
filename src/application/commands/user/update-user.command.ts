import { UpdateUserDto } from "../../dto/user.dto";

export class UpdateUserCommand {
  constructor(public readonly id: string, public readonly dto: UpdateUserDto) {}
}
