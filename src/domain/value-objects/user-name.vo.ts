export class UserNameVO {
  private constructor(private readonly value: string) {}

  static create(name: string): UserNameVO {
    if (name.length < 2 || !name || name.length > 50) {
      throw new Error("Invalid name");
    }
    return new UserNameVO(name);
  }
}
