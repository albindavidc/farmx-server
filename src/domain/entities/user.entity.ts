import { EmailVO } from "@domain/value-objects/user/email.vo.js";
import { NameVO } from "@domain/value-objects/user/name.vo.js";
import { PhoneNumberVO } from "@domain/value-objects/user/phone-number.vo.js";
import { RoleVO } from "@domain/value-objects/user/role.vo.js";
import { ICourseProgress, IUserCertificate } from "@infrastructure/database/schemas/user.schema.js";
import { FarmerStatus } from "@domain/enums/farmer-status.enum";

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
  #hashedPassword: string;
  #role: RoleVO;
  #phone: PhoneNumberVO;
  #id?: string;
  #isVerified?: boolean;
  #isAdmin?: boolean;
  #isBlocked?: boolean;
  #isFarmer?: boolean;
  #courseCertificate?: IUserCertificate[];
  #courseProgress?: ICourseProgress[];
  #googleId?: string;
  #farmerProfile?: FarmerProfile;
  #profilePhoto?: string;
  #bio?: string;
  #reason?: string;

  constructor(
    name: NameVO,
    email: EmailVO,
    hashedPassword: string,
    role: RoleVO,
    phone: PhoneNumberVO,
    id?: string,
    isVerified?: boolean,
    isAdmin?: boolean,
    isBlocked?: boolean,
    isFarmer?: boolean,
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
    this.#id = id;
    this.#isVerified = isVerified;
    this.#isAdmin = isAdmin;
    this.#isBlocked = isBlocked;
    this.#isFarmer = isFarmer;
    this.#courseCertificate = courseCertificate;
    this.#courseProgress = courseProgress;
    this.#googleId = googleId;
    this.#farmerProfile = farmerProfile;
    this.#profilePhoto = profilePhoto;
    this.#bio = bio;
    this.#reason = reason;
  }

  set hashedPassword(newHashedPassword: string) {
    this.#hashedPassword = newHashedPassword;
  }
  set profilePhoto(newProfilePhoto: string) {
    this.#profilePhoto = newProfilePhoto;
  }

  set isVerified(newIsVerified: boolean) {
    this.#isVerified = newIsVerified;
  }

  set isFarmer(newIsFarmer: boolean) {
    this.#isFarmer = newIsFarmer;
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

  get id(): string | undefined {
    return this.#id;
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

  get isFarmer(): boolean | undefined {
    return this.#isFarmer;
  }

  get isVerified(): boolean | undefined {
    return this.#isVerified;
  }

  get isBlocked(): boolean | undefined {
    return this.#isBlocked;
  }

  get isAdmin(): boolean | undefined {
    return this.#isAdmin;
  }

  get hashedPassword(): string {
    return this.#hashedPassword;
  }

  //* ========== Domain methods ========== *//
  public verifyUser(): void {
    this.#isVerified = true;
  }

  public unverifyUser(): void {
    this.#isVerified = false;
  }

  public blockUser(reason: string): void {
    this.#isBlocked = true;
    this.#reason = reason;
  }

  public unblockUser(): void {
    this.#isBlocked = false;
    this.#reason = undefined;
  }

  public promoteToAdmin(): void {
    this.#isAdmin = true;
    this.#role = RoleVO.create(RoleVO.ADMIN);
  }

  public demoteFromAdmin(): void {
    this.#isAdmin = false;
    this.#role = RoleVO.create(RoleVO.USER);
  }

  public enableFarmerMode(farmerProfile: FarmerProfile): void {
    this.#isFarmer = true;
    this.#farmerProfile = farmerProfile;
  }

  public disableFarmerMode(): void {
    this.#isFarmer = false;
    this.#farmerProfile = undefined;
  }

  //* ========== Validations ========== *//
  public canLogin(): boolean | undefined {
    return this.#isVerified && !this.#isBlocked;
  }

  public canCreateCourse(): boolean | undefined {
    return this.#isVerified && !this.#isBlocked && (this.#isAdmin || this.#isFarmer);
  }

  public canUpdateCourse(): boolean | undefined {
    return this.#isVerified && !this.#isBlocked && (this.#isAdmin || this.#isFarmer);
  }

  public canDeleteCourse(): boolean | undefined {
    return this.#isVerified && !this.#isBlocked && (this.#isAdmin || this.#isFarmer);
  }

  public canCreateCertificate(): boolean | undefined {
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
    hashedPassword: string;
    role: string;
    phone: string;
    _id?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    isBlocked?: boolean;
    isFarmer?: boolean;
    courseCertificate?: IUserCertificate[];
    courseProgress?: ICourseProgress[];
    googleId?: string;
    farmerProfile?: FarmerProfile;
    profilePhoto?: string;
    bio?: string;
    reason?: string;
  }): Promise<User> {
    const id = createProps._id;
    const name = NameVO.create(createProps.name);
    const email = EmailVO.create(createProps.email);
    const role = RoleVO.create(createProps.role || RoleVO.USER);
    const phone = PhoneNumberVO.create(createProps.phone || "");

    return new User(
      name,
      email,
      createProps.hashedPassword,
      role,
      phone,
      id,
      false,
      false,
      false,
      false,
      [],
      [],
      createProps.googleId,
      createProps.farmerProfile,
      undefined,
      undefined,
      undefined
    );
  }

  static reconstitute(reconstituteProps: {
    name: string;
    email: string;
    hashedPassword: string;
    role: string;
    phone: string;
    _id?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    isBlocked?: boolean;
    isFarmer?: boolean;
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
      reconstituteProps.hashedPassword,
      RoleVO.create(reconstituteProps.role),
      PhoneNumberVO.create(reconstituteProps.phone),
      reconstituteProps._id,
      reconstituteProps.isVerified,
      reconstituteProps.isAdmin,
      reconstituteProps.isBlocked,
      reconstituteProps.isFarmer,
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
