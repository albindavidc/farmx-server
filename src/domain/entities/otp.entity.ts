export class Otp {
  constructor(
    public readonly email: string,
    public readonly otp: string,
    public readonly expiresAt: Date
  ) {}
}

