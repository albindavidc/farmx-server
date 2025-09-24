import { inject, injectable } from "inversify";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { ISettings } from "@application/interfaces/command/auth/settings.interface";
import { TYPES } from "@presentation/container/types";
import { UploadProfilePhotoCommand } from "@application/commands/upload-profile-photo.command";
import { UserDto } from "@application/dtos/user.dto";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception";

@injectable()
export class SettingsHandler implements ISettings {
  constructor(@inject(TYPES.UserRepository) private readonly userRepo: IUserRepository) {}

  async executeProfilePhotoUpdate(command: UploadProfilePhotoCommand): Promise<void> {
    const user = await this.userRepo.findById(command.userId);

    if (!user) throw new UserNotFoundException("User not found");

    user.profilePhoto = command.photoPath;
    await this.userRepo.update(command.userId, user);
  }

  async executeGetProfilePhotoHandler(userId: string | number): Promise<string | null> {
    return this.userRepo.getProfilePhotoPath(userId);
  }

  async executeUpdateProfile(userId: string, updates: Partial<UserDto>): Promise<UserDto | null> {
    return this.userRepo.update(userId, updates);
  }
}
