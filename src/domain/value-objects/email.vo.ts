export class Email {
  private readonly value: string;

  private constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error("Invalid email address");
    }
    this.value = email;
  }

  private isValid(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static create(email: string): Email {
    return new Email(email);
  }

  toString(): string {
    return this.value;
  }
}
