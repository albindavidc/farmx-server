import { UserDto } from "@application/dto/user.dto";
import { SignupRequestDto } from "@application/dto/user.dto";

export interface ISignUp {
  execute(dto: SignupRequestDto): Promise<UserDto>;
}
