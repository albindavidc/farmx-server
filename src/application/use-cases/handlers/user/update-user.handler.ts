import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/container/types";
import { UserRepository } from "../../../../domain/interfaces/repositories/user.repository";
import { UpdateUserCommand } from "../../commands/user/update-user.command";
import { UserDto } from "../../dto/User.dto";

@injectable()
export class UpdateUserHandler {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

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
    if (dto.farmerStatus !== undefined) update.farmerStatus = dto.farmerStatus;
    if (dto.farmerRegId !== undefined) update.farmerRegId = dto.farmerRegId;
    if (dto.experience !== undefined) update.experience = dto.experience;
    if (dto.qualification !== undefined) update.qualification = dto.qualification;
    if (dto.expertise !== undefined) update.expertise = dto.expertise;
    if (dto.awards !== undefined) update.awards = dto.awards;

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
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      role: updatedUser.role,
      phone: updatedUser.phone,
      isVerified: updatedUser.isVerified,
      isAdmin: updatedUser.isAdmin,
      isBlocked: updatedUser.isBlocked,
      googleId: updatedUser.googleId,

      isFarmer: updatedUser.isFarmer,
      farmerStatus: updatedUser.farmerStatus,
      farmerRegId: updatedUser.farmerRegId,
      experience: updatedUser.experience,
      qualification: updatedUser.qualification,
      expertise: updatedUser.expertise,
      awards: updatedUser.awards,
      profilePhoto: updatedUser.profilePhoto,
      bio: updatedUser.bio,
      courseProgress: updatedUser.courseProgress,
      reason: updatedUser.reason,
      courseCertificate: updatedUser.courseCertificate,
    };
  }
}
