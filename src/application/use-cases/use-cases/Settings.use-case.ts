import { inject, injectable } from "inversify";
import { UserRepository } from "../../../domain/interfaces/repositories/User.repository";
import { TYPES } from "../../../presentation/container/Types";
import { UploadProfilePhotoCommand } from "../commands/UploadProfilePhoto.command";
import { UserDto } from "../dto/User.dto";

@injectable()
export class SettingsUseCase {
  constructor(@inject(TYPES.UserRepository) private readonly userRepo: UserRepository) {}

  async executeProfilePhotoUpdate(command: UploadProfilePhotoCommand): Promise<void> {
    const user = await this.userRepo.findById(command.userId);

    if (!user) throw new Error("User not found");

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
