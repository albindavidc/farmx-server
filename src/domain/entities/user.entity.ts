import { CourseProgress } from "../../infrastructure/database/schemas/UserSchema";
import { FarmerStatus } from "../enums/FarmerStatus.enum";
import { Password } from "../value-objects/Password.vo";

export class User {
  private readonly _password: Promise<Password>;

  constructor(
    public name: string,
    public email: string,
    public password: string | Password,
    public role: string,
    public phone: string,
    public _id?: string,
    public isVerified: boolean = false,
    public isAdmin: boolean = false,
    public isBlocked: boolean = false,
    public googleId?: string,

    public isFarmer: boolean = false,
    public farmerRegId?: string,
    public experience?: number,
    public qualification?: string,
    public expertise?: string[],
    public awards?: string[],
    public farmerStatus?: FarmerStatus,
    public profilePhoto?: string,
    public bio?: string,
    public courseProgress?: CourseProgress[],
    public reason?: string
  ) {
    this._password =
      typeof password === "string"
        ? Password.hash(password)
        : Promise.resolve(password);
  }

  async getHashedPassword(): Promise<string> {
    const pwd = await this._password;
    return pwd.getHashedValue();
  }

  public async verifyPassword(plainText: string): Promise<boolean> {
    const password = await this._password;
    return password.compare(plainText);
  }
}
