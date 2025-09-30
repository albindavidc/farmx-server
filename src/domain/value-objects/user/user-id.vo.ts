// import { isValidObjectId } from "mongoose";
// import { Types } from "mongoose";

// export class UserIdVO {
//   private constructor(public readonly value: string) {}

//   static create(id?: string): UserIdVO {
//     if (id) {
//       id = new Types.ObjectId(id).toString(); // Normalize the ID
//       if (!isValidObjectId(id)) {
//         throw new Error("Invalid User ID");
//       }
//       return new UserIdVO(id);
//     }

//     return new UserIdVO(new Types.ObjectId().toString());
//   }
// }
