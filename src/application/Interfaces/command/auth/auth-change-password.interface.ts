export interface IAuthChangePassword {
  changePassword(userId: string, newPassword: string, confirmPassword: string): Promise<void>;
}
