export class Email {
  private readonly value: string;
  private constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error("Invalid email address");
    }
    this.value = email;
  }

  static create(email: string): Email {
    return new Email(email);
  }

  toString(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegx.test(email);
  }
}
