import { User } from "../../domain/entities/user.entity";
import { RegisterResponse } from "../dto/auth/register.response";

export class UserMapper {
  static toRegisterResponse(user: User): RegisterResponse {
    return new RegisterResponse(
      user.id,
      user.name,
      user.email.toString(),
      user.phone
    );
  }
}
