export class RoleVO {
  static readonly ADMIN = "admin";
  static readonly USER = "user";
  static readonly FARMER = "farmer";

  private constructor(public readonly value: string) {}

  static create(role: string): RoleVO {
    const validRoles = [this.ADMIN, this.USER, this.FARMER];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid user role");
    }

    return new RoleVO(role);
  }
}
