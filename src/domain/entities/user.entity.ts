import { Email } from "../value-objects/email.vo";
import { Password } from "../value-objects/password.vo";
import { UserRole } from "../enums/user-role.enum";

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly phone: string,
    public readonly password: Password,
    public readonly roles: UserRole[],
    public readonly isVerified: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly firebasedUid?: string
  ) {}

  static create(props: {
    name: string;
    email: Email;
    phone: string;
    password: Password;
    role?: UserRole[];
    firebaseUid?: string;
  }): User {
    const id = "user-" + Math.random().toString(36).substr(2, 9);
    return new User(
      id,
      props.name,
      props.email,
      props.phone,
      props.password,
      props.role || [UserRole.USER],
      false,
      new Date(),
      new Date(),
      props.firebaseUid
    );
  }

  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }
}
