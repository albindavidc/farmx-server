import { Email } from "../../../../domain/value-objects/Email.vo";

export class GetUserQuery {
  constructor(public readonly email: Email) {}
}
