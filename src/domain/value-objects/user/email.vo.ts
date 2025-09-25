export class EmailVO {
  public readonly value: string;
  private constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error("Invalid email address");
    }
    this.value = email;
  }

  static create(email: string): EmailVO {
    return new EmailVO(email.toLowerCase());
  }

  toString(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegx.test(email);
  }
}
