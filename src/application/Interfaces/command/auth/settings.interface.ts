import { UploadProfilePhotoCommand } from "@application/commands/upload-profile-photo.command.js";
import { UserDto } from "@application/dtos/user.dto.js";
import { User } from "@domain/entities/user.entity.js";

export interface ISettings {
  executeProfilePhotoUpdate(command: UploadProfilePhotoCommand): Promise<void>;
  executeGetProfilePhotoHandler(userId: string | number): Promise<string | null>;
  executeUpdateProfile(userId: string, updates: Partial<UserDto>): Promise<User | null>;
}
