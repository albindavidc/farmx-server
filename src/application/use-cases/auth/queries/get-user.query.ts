import { Email } from "../../../../domain/value-objects/email.vo";

export class GetUserQuery {
  constructor(public readonly email: Email) {}
}
