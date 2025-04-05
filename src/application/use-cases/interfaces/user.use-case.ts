import { RoleUpdateDto } from "../auth/dto/Role.dto";
import { SignupRequestDto, UserDto } from "../auth/dto/User.dto";

export interface UserUseCase {
  signup(dto: SignupRequestDto): Promise<UserDto>;
  getUser(id: string): Promise<UserDto>;
  setRole(dto: RoleUpdateDto): Promise<RoleUpdateDto>;
}
