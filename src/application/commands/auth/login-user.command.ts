import { LoginRequest } from "@application/dtos/login.dto.js";

export class LoginUserCommand {
  constructor(public readonly dto: LoginRequest) {}
}
