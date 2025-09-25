export class NameVO {
  private constructor(public readonly value: string) {}

  static create(name: string): NameVO {
    if (name.length < 2 || !name || name.length > 50) {
      throw new Error("Invalid name");
    }
    return new NameVO(name);
  }
}
