import * as argon2 from "argon2";

export class PasswordVO {
  private constructor(public readonly hashedPassword: string) {}

  /* Creates a hashed password from plain text */
  public static async hash(plainText: string): Promise<PasswordVO> {
    return new PasswordVO(
      await argon2.hash(plainText, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
      })
    );
  }

  public static create(hashedPassword: string): PasswordVO {
    return new PasswordVO(hashedPassword);
  }

  /* Compares plain text with stored hash */
  public static async compare(plainText: string, hashedP: string): Promise<boolean> {
    return argon2.verify(hashedP, plainText);
  }

  /* Gets the hashed value (for persistence) */
  public getHashedValue(): string {
    return this.hashedPassword;
  }
}
