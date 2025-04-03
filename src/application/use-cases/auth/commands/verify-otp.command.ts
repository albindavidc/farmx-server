export class VerifyOtpCommand {
  constructor(
    public readonly userId: string,
    public readonly code: string
  ) {}
}
