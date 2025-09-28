import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { UploadProfilePhotoCommand } from "@application/commands/upload-profile-photo.command.js";
import { UserDto } from "@application/dtos/user.dto.js";
import { UserNotFoundException } from "@application/exceptions/user-not-found.exception.js";
import { ISettings } from "@application/interfaces/command/auth/settings.interface.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";
import { User } from "@domain/entities/user.entity.js";

@injectable()
export class SettingsHandler implements ISettings {
  constructor(@inject(TYPES.UserRepository) private readonly userRepo: IUserRepository) {}

  async executeProfilePhotoUpdate(command: UploadProfilePhotoCommand): Promise<void> {
    const user = await this.userRepo.findById(command.userId);

    if (!user) throw new UserNotFoundException("User not found");

    /* updating to the entity */
    user.profilePhoto = command.photoPath;

    const updates: Partial<UserDto> = { profilePhoto: command.photoPath };
    await this.userRepo.update(command.userId, updates);
  }

  async executeGetProfilePhotoHandler(userId: string | number): Promise<string | null> {
    return this.userRepo.getProfilePhotoPath(userId);
  }

  async executeUpdateProfile(userId: string, updates: Partial<UserDto>): Promise<User | null> {
    return this.userRepo.update(userId, updates);
  }
}
