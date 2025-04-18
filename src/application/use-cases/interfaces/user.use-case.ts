import { User } from "../../../domain/entities/User.entity";
import { UploadProfilePhotoCommand } from "../commands/UploadProfilePhoto.command";
import { RoleUpdateDto } from "../dto/Role.dto";
import { SignupRequestDto, UserDto } from "../dto/User.dto";

export interface UserUseCase {
  signup(dto: SignupRequestDto): Promise<UserDto>;
  getUser(id: string): Promise<UserDto>;
  setRole(dto: RoleUpdateDto): Promise<RoleUpdateDto>;
  execute(user: User): Promise<UserDto>;

  uploadProfilePhoto(command: UploadProfilePhotoCommand): Promise<void>;
}
