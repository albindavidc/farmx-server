import {  UserDto } from "../../dto/User.dto";

export class CreateUserCommand {
  constructor(public readonly dto: UserDto) {}
}
