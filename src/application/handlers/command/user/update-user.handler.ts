import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { UpdateUserCommand } from "@application/commands/user/update-user.command.js";
import { UserDto } from "@application/dtos/user.dto.js";
import { IUpdateUser } from "@application/interfaces/command/user/update-user.interface.js";
import { IUserRepository } from "@domain/interfaces/user-repository.interface.js";

@injectable()
export class UpdateUserHandler implements IUpdateUser {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UserDto> {
    const { id, dto } = command;

    const update: Partial<UserDto> = {};

    if (dto.name !== undefined) update.name = dto.name;
    if (dto.email !== undefined) update.email = dto.email;
    if (dto.password !== undefined) update.password = dto.password;
    if (dto.role !== undefined) update.role = dto.role;
    if (dto.phone !== undefined) update.phone = dto.phone;
    if (dto.isVerified !== undefined) update.isVerified = dto.isVerified;
    if (dto.isBlocked !== undefined) update.isBlocked = dto.isBlocked;
    if (dto.isAdmin !== undefined) update.isAdmin = dto.isAdmin;
    if (dto.isBlocked !== undefined) update.isBlocked = dto.isBlocked;
    if (dto.googleId !== undefined) update.googleId = dto.googleId;

    if (dto.isFarmer !== undefined) update.isFarmer = dto.isFarmer;
    if (dto.farmerProfile !== undefined) update.farmerProfile = dto.farmerProfile;
    if (dto.profilePhoto !== undefined) update.profilePhoto = dto.profilePhoto;
    if (dto.bio !== undefined) update.bio = dto.bio;
    if (dto.courseProgress !== undefined) update.courseProgress = dto.courseProgress;
    if (dto.reason !== undefined) update.reason = dto.reason;
    if (dto.courseCertificate !== undefined) update.courseCertificate = dto.courseCertificate;

    const updatedUser = await this.userRepository.update(id, update);
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found on the DB`);
    }

    return {
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.hashedPassword,
      role: updatedUser.role,
      phone: updatedUser.phone,
      isVerified: updatedUser.isVerified,
      isAdmin: updatedUser.isAdmin,
      isBlocked: updatedUser.isBlocked,
      googleId: updatedUser.googleId,

      isFarmer: updatedUser.isFarmer,
      farmerProfile: updatedUser.farmerProfile,
      profilePhoto: updatedUser.profilePhoto,
      bio: updatedUser.bio,
      courseProgress: updatedUser.courseProgress,
      reason: updatedUser.reason,
      courseCertificate: updatedUser.courseCertificate,
      timestamps: updatedUser.timestamps,
    };
  }
}
