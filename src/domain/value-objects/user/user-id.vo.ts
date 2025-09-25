import { isValidObjectId } from "mongoose";
import { Types } from "mongoose";

export class UserIdVO {
  private constructor(public readonly value: string) {}

  static create(id?: string): UserIdVO {
    if (!id || !isValidObjectId(id)) {
      throw new Error("Invalid User ID");
    }
    return new UserIdVO(id || new Types.ObjectId().toString());
  }
}
