export class ChangePasswordCommand {
  constructor(
    public readonly userId: string,
    public readonly newPassword: string,
    public readonly confirmPassword: string
  ) {}
}

