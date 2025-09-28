import { UpdateUserDto } from "@application/dtos/user.dto.js";

export class UpdateUserCommand {
  constructor(public readonly id: string, public readonly dto: UpdateUserDto) {}
}
