import { User } from "../../../domain/entities/user.entity";
import { UploadProfilePhotoCommand } from "../commands/upload-profile-photo.command";
import { RoleUpdateDto } from "../dto/Role.dto";
import { SignupRequestDto, UserDto } from "../dto/User.dto";

export interface UserUseCase {
  signup(dto: SignupRequestDto): Promise<UserDto>;
  getUser(id: string): Promise<UserDto>;
  setRole(dto: RoleUpdateDto): Promise<RoleUpdateDto>;
  execute(user: User): Promise<UserDto>;

  uploadProfilePhoto(command: UploadProfilePhotoCommand): Promise<void>;
}
