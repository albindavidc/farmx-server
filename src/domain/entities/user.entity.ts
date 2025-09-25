import { ICourseProgress, IUserCertificate } from "@infrastructure/database/schemas/user.schema";
import { FarmerStatus } from "../enums/farmer-status.enum";
import { EmailVO } from "@domain/value-objects/user/email.vo";
import { PhoneNumberVO } from "@domain/value-objects/user/phone-number.vo";
import { NameVO } from "@domain/value-objects/user/name.vo";
import { PasswordVO } from "@domain/value-objects/user/password.vo";
import { RoleVO } from "@domain/value-objects/user/role.vo";
import { UserIdVO } from "@domain/value-objects/user/user-id.vo";

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
    public readonly id: UserIdVO,
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
    farmerProfile?: FarmerProfile;
    isFarmer?: boolean;
  }): Promise<User> {
    const id = UserIdVO.create();
    const name = NameVO.create(createProps.name);
    const email = EmailVO.create(createProps.email);
    const role = RoleVO.create(createProps.role || RoleVO.USER);
    const phone = PhoneNumberVO.create(createProps.phone || "");
    const hashedPassword = await PasswordVO.hash(createProps.password);

    return new User(
      name,
      email,
      hashedPassword,
      role,
      phone,
      false,
      false,
      false,
      false,
      [],
      [],
      { createdAt: new Date(), updatedAt: new Date() },
      id,
      createProps.googleId
    );
  }

  static reconstitute(reconstituteProps: {
    name: string;
    email: string;
    hashedPassword: string;
    role: string;
    phone: string;
    isVerified: boolean;
    isAdmin: boolean;
    isBlocked: boolean;
    isFarmer: boolean;
    courseCertificate?: IUserCertificate[];
    courseProgress?: ICourseProgress[];
    timestamps: {
      createdAt: Date;
      updatedAt: Date;
    };
    id: string;
    googleId?: string;
    farmerProfile?: FarmerProfile;
    profilePhoto?: string;
    bio?: string;
    reason?: string;
  }): User {
    return new User(
      NameVO.create(reconstituteProps.name),
      EmailVO.create(reconstituteProps.email),
      PasswordVO.create(reconstituteProps.hashedPassword),
      RoleVO.create(reconstituteProps.role),
      PhoneNumberVO.create(reconstituteProps.phone),
      reconstituteProps.isVerified,
      reconstituteProps.isAdmin,
      reconstituteProps.isBlocked,
      reconstituteProps.isFarmer,
      reconstituteProps.courseCertificate,
      reconstituteProps.courseProgress,
      reconstituteProps.timestamps,
      UserIdVO.create(reconstituteProps.id),
      reconstituteProps.googleId,
      reconstituteProps.farmerProfile,
      reconstituteProps.profilePhoto,
      reconstituteProps.bio,
      reconstituteProps.reason
    );
  }
}
