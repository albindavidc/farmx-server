import { injectable, inject } from "inversify";
import { TYPES } from "../../../../presentation/container/types";
import { UpdateCommunityCommand } from "../../commands/community/update-community.command";
import { CommunityResponseDto } from "../../dto/community/community-response.dto";
import { CommunityRepository } from "../../../../domain/interfaces/repositories/community/community.repository";

@injectable()
export class UpdateCommunityCommandHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async handle(command: UpdateCommunityCommand): Promise<CommunityResponseDto> {
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
      if (existingCommunity && existingCommunity.id !== id) {
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
    const updatedCommunity = await this.communityRepository.update(community);

    // Return the response DTO
    return CommunityResponseDto.fromEntity(updatedCommunity);
  }
}
