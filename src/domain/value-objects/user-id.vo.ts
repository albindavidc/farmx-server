import { isValidObjectId } from "mongoose";

export class UserId {
  private constructor(private readonly value: string) {}

  static create(id: string): UserId {
    if (!id || !isValidObjectId(id)) {
      throw new Error("Invalid User ID");
    }
    return new UserId(id);
  }
}
