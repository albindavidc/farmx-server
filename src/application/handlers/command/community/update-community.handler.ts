import { injectable, inject } from "inversify";
import { TYPES } from "@presentation/container/types";
import { UpdateCommunityCommand } from "@application/commands/community/update-community.command";
import { IUpdateCommunity } from "@application/interfaces/command/community/update-community.interface";
import { CommunityResponseDto } from "@application/dtos/community/community-response.dto";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";

import { CommunityMapper } from "@application/mappers/community/community.mapper";

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

    const communityEntity = CommunityMapper.updateDtoToEntity(data, community);

    if (!communityEntity) {
      throw new Error("Failed to update community");
    }

    // Update the community entity
    if (data.name !== undefined) {
      communityEntity.name = data.name.trim();

      // Check if the new name is already taken by another community
      const existingCommunity = await this.communityRepository.findByName(data.name);
      if (existingCommunity && existingCommunity.id !== id) {
        throw new Error(`Community with name '${data.name}' already exists`);
      }
    }

    if (data.description !== undefined) {
      communityEntity.description = data.description.trim();
    }

    if (data.imageUrl !== undefined) {
      communityEntity.imageUrl = data.imageUrl;
    }

    if (data.categories !== undefined) {
      communityEntity.categories = data.categories;
    }

    // Save the updated community
    const updatedCommunity = await this.communityRepository.update(id, community);

    if (!updatedCommunity) {
      throw new Error("Failed to update community ");
    }

    return CommunityMapper.entityToDto(updatedCommunity);
  }
}
