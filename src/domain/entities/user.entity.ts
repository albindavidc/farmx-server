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
  #name: NameVO;
  #email: EmailVO;
  #hashedPassword: PasswordVO;
  #role: RoleVO;
  #phone: PhoneNumberVO;
  #isVerified: boolean;
  #isAdmin: boolean;
  #isBlocked: boolean;
  #isFarmer: boolean;
  #courseCertificate?: IUserCertificate[];
  #id: UserIdVO;
  #courseProgress?: ICourseProgress[];
  #timestamps: { createdAt: Date; updatedAt: Date };
  #googleId?: string;
  #farmerProfile?: FarmerProfile;
  #profilePhoto?: string;
  #bio?: string;
  #reason?: string;

  constructor(
    name: NameVO,
    email: EmailVO,
    hashedPassword: PasswordVO,
    role: RoleVO,
    phone: PhoneNumberVO,
    isVerified: boolean,
    isAdmin: boolean,
    isBlocked: boolean,
    isFarmer: boolean,
    timestamps: {
      createdAt: Date;
      updatedAt: Date;
    },
    id: UserIdVO,
    courseCertificate?: IUserCertificate[],
    courseProgress?: ICourseProgress[],
    googleId?: string,
    farmerProfile?: FarmerProfile,
    profilePhoto?: string,
    bio?: string,
    reason?: string
  ) {
    this.#name = name;
    this.#email = email;
    this.#hashedPassword = hashedPassword;
    this.#role = role;
    this.#phone = phone;
    this.#isVerified = isVerified;
    this.#isAdmin = isAdmin;
    this.#isBlocked = isBlocked;
    this.#isFarmer = isFarmer;
    this.#timestamps = timestamps;
    this.#id = id;
    this.#courseCertificate = courseCertificate;
    this.#courseProgress = courseProgress;
    this.#googleId = googleId;
    this.#farmerProfile = farmerProfile;
    this.#profilePhoto = profilePhoto;
    this.#bio = bio;
    this.#reason = reason;
  }

  public async verifyPassword(plainText: string): Promise<boolean> {
    return PasswordVO.compare(plainText, this.#hashedPassword.getHashedValue());
  }

  //* ========== Getters ========== *//
  get name(): string {
    return this.#name.value;
  }

  get email(): string {
    return this.#email.value;
  }

  get role(): string {
    return this.#role.value;
  }

  get phone(): string {
    return this.#phone.value;
  }

  get id(): string {
    return this.#id.value;
  }

  get googleId(): string | undefined {
    return this.#googleId;
  }

  get farmerProfile(): FarmerProfile | undefined {
    return this.#farmerProfile;
  }

  get profilePhoto(): string | undefined {
    return this.#profilePhoto;
  }

  get bio(): string | undefined {
    return this.#bio;
  }

  get reason(): string | undefined {
    return this.#reason;
  }

  get courseCertificate(): IUserCertificate[] | undefined {
    return this.#courseCertificate;
  }

  get courseProgress(): ICourseProgress[] | undefined {
    return this.#courseProgress;
  }

  get isFarmer(): boolean {
    return this.#isFarmer;
  }

  get isVerified(): boolean {
    return this.#isVerified;
  }

  get isBlocked(): boolean {
    return this.#isBlocked;
  }

  get isAdmin(): boolean {
    return this.#isAdmin;
  }

  get timestamps(): { createdAt: Date; updatedAt: Date } {
    return this.#timestamps;
  }

  //* ========== Domain methods ========== *//
  public verifyUser(): void {
    this.#isVerified = true;
    this.#timestamps.updatedAt = new Date();
  }

  public unverifyUser(): void {
    this.#isVerified = false;
    this.#timestamps.updatedAt = new Date();
  }

  public blockUser(reason: string): void {
    this.#isBlocked = true;
    this.#reason = reason;
    this.#timestamps.updatedAt = new Date();
  }

  public unblockUser(): void {
    this.#isBlocked = false;
    this.#reason = undefined;
    this.#timestamps.updatedAt = new Date();
  }

  public promoteToAdmin(): void {
    this.#isAdmin = true;
    this.#role = RoleVO.create(RoleVO.ADMIN);
    this.#timestamps.updatedAt = new Date();
  }

  public demoteFromAdmin(): void {
    this.#isAdmin = false;
    this.#role = RoleVO.create(RoleVO.USER);
    this.#timestamps.updatedAt = new Date();
  }

  public enableFarmerMode(farmerProfile: FarmerProfile): void {
    this.#isFarmer = true;
    this.#farmerProfile = farmerProfile;
    this.#timestamps.updatedAt = new Date();
  }

  public disableFarmerMode(): void {
    this.#isFarmer = false;
    this.#farmerProfile = undefined;
    this.#timestamps.updatedAt = new Date();
  }

  //* ========== Validations ========== *//
  public canLogin(): boolean {
    return this.#isVerified && !this.#isBlocked;
  }

  public canCreateCourse(): boolean {
    return this.#isVerified && !this.#isBlocked && (this.#isAdmin || this.#isFarmer);
  }

  public canUpdateCourse(): boolean {
    return this.#isVerified && !this.#isBlocked && (this.#isAdmin || this.#isFarmer);
  }

  public canDeleteCourse(): boolean {
    return this.#isVerified && !this.#isBlocked && (this.#isAdmin || this.#isFarmer);
  }

  public canCreateCertificate(): boolean {
    return this.#isVerified && !this.#isBlocked && (this.#isAdmin || this.#isFarmer);
  }

  public getAccountStatus(): string {
    if (this.#isBlocked) return "blocked";
    if (this.#isVerified) return "verified";
    if (this.#isAdmin) return "admin";
    if (this.#isFarmer) return "farmer";
    return "ACTIVE";
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
      { createdAt: new Date(), updatedAt: new Date() },
      id,
      [],
      [],
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
    timestamps: {
      createdAt: Date;
      updatedAt: Date;
    };
    id: string;
    courseCertificate?: IUserCertificate[];
    courseProgress?: ICourseProgress[];
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
      reconstituteProps.timestamps,
      UserIdVO.create(reconstituteProps.id),
      reconstituteProps.courseCertificate,
      reconstituteProps.courseProgress,
      reconstituteProps.googleId,
      reconstituteProps.farmerProfile,
      reconstituteProps.profilePhoto,
      reconstituteProps.bio,
      reconstituteProps.reason
    );
  }
}
