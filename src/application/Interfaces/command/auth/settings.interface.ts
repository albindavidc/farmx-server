import { UserDto } from "@application/dto/user.dto";
import { UploadProfilePhotoCommand } from "@application/commands/upload-profile-photo.command";

export interface ISettings {
  executeProfilePhotoUpdate(command: UploadProfilePhotoCommand): Promise<void>;
  executeGetProfilePhotoHandler(userId: string | number): Promise<string | null>;
  executeUpdateProfile(userId: string, updates: Partial<UserDto>): Promise<UserDto | null>;
}
