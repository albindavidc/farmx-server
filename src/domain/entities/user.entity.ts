import { ICourseProgress, IUserCertificate } from "@infrastructure/database/schemas/user.schema";
import { FarmerStatus } from "../enums/farmer-status.enum";
import { EmailVO } from "@domain/value-objects/user/email.vo";
import { PhoneNumberVO } from "@domain/value-objects/user/phone-number.vo";
import { NameVO } from "@domain/value-objects/user/name.vo";
import { PasswordVO } from "@domain/value-objects/user/password.vo";
import { RoleVO } from "@domain/value-objects/user/role.vo";

export class FarmerProfile {
  constructor(
    public farmerStatus?: FarmerStatus,
    public farmerRegId?: string,
    public experience?: number,
    public qualification?: string,
    public expertise?: string[],
    public awards?: string[]
  ) {}
}

export class User {
  constructor(
    public readonly name: NameVO,
    public readonly email: EmailVO,
    public readonly hashedPassword: PasswordVO,
    public readonly role: RoleVO,
    public readonly phone: PhoneNumberVO,
    public readonly isVerified: boolean = false,
    public readonly isAdmin: boolean = false,
    public readonly isBlocked: boolean = false,
    public readonly isFarmer: boolean = false,
    public readonly courseCertificate: IUserCertificate[] = [],
    public readonly courseProgress: ICourseProgress[] = [],
    public readonly timestamps: {
      createdAt: Date;
      updatedAt: Date;
    },
    public readonly _id?: string,
    public readonly googleId?: string,

    public readonly farmerProfile?: FarmerProfile,
    public readonly profilePhoto?: string,
    public readonly bio?: string,
    public readonly reason?: string
  ) {}

  public async verifyPassword(plainText: string): Promise<boolean> {
    return PasswordVO.compare(plainText, this.hashedPassword.getHashedValue());
  }

  static async create(createProps: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    googleId?: string;
  }): Promise<User> {
    const name = NameVO.create(createProps.name);
    const email = EmailVO.create(createProps.email);
    const role = RoleVO.create(createProps.role || RoleVO.USER);
    const phone = PhoneNumberVO.create(createProps.phone || "");
    const password = await PasswordVO.hash(createProps.password);

    return new User(
      name,
      email,
      password,
      role,
      phone,
      false,
      false,
      false,
      false,
      [],
      [],
      { createdAt: new Date(), updatedAt: new Date() },
      undefined,
      createProps.googleId
    );
  }
}
