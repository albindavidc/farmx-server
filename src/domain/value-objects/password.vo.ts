export class Password {
  private readonly value: string;

  constructor(password: string) {
    if (password.length < 8) {
      throw new Error("Password has to be more than 8 characters");
    }
    this.value = password;
  }

  static create(password: string): Password {
    return new Password(password);
  }

  toString(): string {
    return this.value;
  }

  async getHashedVersion(): Promise<string> {
    //Hashing will be implemented inside the infrastructure
    return this.value;
  }
}
