import { injectable, inject } from "inversify";
import { DeleteCommunityCommand } from "../../commands/community/delete-community.command";
import { CommunityRepository } from "../../../../domain/interfaces/repositories/community/community.repository";
import { TYPES } from "../../../../presentation/container/types";

@injectable()
export class DeleteCommunityCommandHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async handle(command: DeleteCommunityCommand): Promise<boolean> {
    const { id } = command;

    // Check if the community exists
    const exists = await this.communityRepository.exists(id);
    if (!exists) {
      throw new Error(`Community with ID '${id}' not found`);
    }

    // Delete the community
    return await this.communityRepository.delete(id);
  }
}
