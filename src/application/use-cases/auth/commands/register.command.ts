import { Email } from "../../../../domain/value-objects/email.vo";
import { Password } from "../../../../domain/value-objects/password.vo";

export class RegisterCommand  {
  constructor(
    public readonly name: string,
    public readonly email: Email,
    public readonly phone: string,
    public readonly password: Password
  ) {}
}
