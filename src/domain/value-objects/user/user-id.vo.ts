import { isValidObjectId } from "mongoose";

export class UserIdVO {
  private constructor(private readonly value: string) {}

  static create(id: string): UserIdVO {
    if (!id || !isValidObjectId(id)) {
      throw new Error("Invalid User ID");
    }
    return new UserIdVO(id);
  }
}
