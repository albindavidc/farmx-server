import * as argon2 from "argon2";

export class Password {
  private constructor(private readonly hashedPassword: string) {}

  /* Creates a hashed password from plain text */
  public static async hash(plainText: string): Promise<Password> {
    return new Password(
      await argon2.hash(plainText, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
      })
    );
  }

  /* Compares plain text with stored hash */
  public async compare(plainText: string): Promise<boolean> {
    return argon2.verify(this.hashedPassword, plainText);
  }

  /* Gets the hashed value (for persistence) */
  public getHashedValue(): string {
    return this.hashedPassword;
  }
}
