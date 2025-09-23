import { inject, injectable } from "inversify";
import { UserRepository } from "../../../../domain/repositories/user.repository";
import { TYPES } from "../../../../presentation/container/types";
import { UploadProfilePhotoCommand } from "../../../commands/upload-profile-photo.command";
import { UserDto } from "../../../dto/User.dto";
import { UserNotFoundException } from "../../../exceptions/UserNotFound.exception";

@injectable()
export class SettingsHandler {
  constructor(@inject(TYPES.UserRepository) private readonly userRepo: UserRepository) {}

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
