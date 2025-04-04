import { Email } from "../../../../domain/value-objects/Email.vo";
import { Password } from "../../../../domain/value-objects/Password.vo";

export class RegisterCommand  {
  constructor(
    public readonly name: string,
    public readonly email: Email,
    public readonly phone: string,
    public readonly password: Password
  ) {}
}
