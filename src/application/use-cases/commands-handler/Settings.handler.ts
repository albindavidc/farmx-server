import { inject, injectable } from "inversify";
import { UserRepository } from "../../../domain/interfaces/repositories/User.repository";
import { TYPES } from "../../../presentation/container/Types";
import { UploadProfilePhotoCommand } from "../commands/UploadProfilePhoto.command";

@injectable()
export class SettingsHandler {
  constructor(@inject(TYPES.UserRepository) private readonly userRepo: UserRepository) {}

  async executeProfilePhotoUpdate(command: UploadProfilePhotoCommand): Promise<void> {
    const user = await this.userRepo.findById(command.userId);

    if (!user) throw new Error("User not found");

    user.profilePhoto = command.photoPath;
    await this.userRepo.update(command.userId, user);
  }
}
