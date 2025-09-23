export class LoginChangePasswordCommand {
  constructor(
    public readonly email: string,
    public readonly newPassword: string,
    public readonly confirmPassword: string
  ) {}
}
