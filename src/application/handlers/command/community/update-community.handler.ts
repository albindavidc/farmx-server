import { injectable, inject } from "inversify";
import { TYPES } from "@presentation/container/types";
import { UpdateCommunityCommand } from "@application/commands/community/update-community.command";
import { IUpdateCommunity } from "@application/interfaces/command/community/update-community.interface";
import { CommunityResponseDto } from "@application/dtos/community/community-response.dto";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";

@injectable()
export class UpdateCommunityCommandHandler implements IUpdateCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(command: UpdateCommunityCommand): Promise<CommunityResponseDto> {
    const { id, data } = command;

    // Find the community
    const community = await this.communityRepository.findById(id);
    if (!community) {
      throw new Error(`Community with ID '${id}' not found`);
    }

    // Update the community entity
    if (data.name !== undefined) {
      community.updateName(data.name);

      // Check if the new name is already taken by another community
      const existingCommunity = await this.communityRepository.findByName(data.name);
      if (existingCommunity && existingCommunity.getId() !== id) {
        throw new Error(`Community with name '${data.name}' already exists`);
      }
    }

    if (data.description !== undefined) {
      community.updateDescription(data.description);
    }

    if (data.imageUrl !== undefined) {
      community.updateImageUrl(data.imageUrl);
    }

    if (data.categories !== undefined) {
      community.updateCategories(data.categories);
    }

    // Save the updated community
    const updatedCommunity = await this.communityRepository.update(id, community);

    if (!updatedCommunity) {
      throw new Error("Failed to update community ");
    }

    // Return the response DTO
    return CommunityResponseDto.fromEntity({
      id: updatedCommunity.getId(),
      name: updatedCommunity.getName(),
      description: updatedCommunity.getDescription(),
      isActive: updatedCommunity.getIsActive(),
      createdBy: updatedCommunity.getCreatedBy(),
      createdAt: updatedCommunity.getCreatedAt(),
      membersCount: updatedCommunity.getMemberCount
        ? updatedCommunity.getMemberCount()
        : updatedCommunity.getMemberCount?.() || 0,
      imageUrl: updatedCommunity.getImageUrl(),
      categories: updatedCommunity.getCategories(),
    });
  }
}
