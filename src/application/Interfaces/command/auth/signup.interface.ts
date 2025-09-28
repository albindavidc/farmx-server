import { SignupRequestDto, UserDto } from "@application/dtos/user.dto.js";

export interface ISignUp {
  execute(dto: SignupRequestDto): Promise<UserDto>;
}
