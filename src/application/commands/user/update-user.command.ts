import { UpdateUserDto } from "@application/dtos/user.dto";

export class UpdateUserCommand {
  constructor(public readonly id: string, public readonly dto: UpdateUserDto) {}
}
