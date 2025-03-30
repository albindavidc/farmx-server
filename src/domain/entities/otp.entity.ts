export class OTP {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly code: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly isUsed: boolean
  ) {}

  static create(userId: string, code: string, expiresInMinutes: number): OTP {
    const id = "otp-" + Math.random().toString(36).substr(2, 9);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getMinutes() + expiresInMinutes);
    return new OTP(id, userId, code, expiresAt, new Date(), false);
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
