export class UserExistsException extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exsits`);
    this.name = "UserExistsException";
  }
}
