import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { DeleteCommunityCommand } from "@application/commands/community/delete-community.command.js";
import { IDeleteCommunity } from "@application/interfaces/command/community/delete-community.interface.js";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface.js";

@injectable()
export class DeleteCommunityCommandHandler implements IDeleteCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(command: DeleteCommunityCommand): Promise<boolean> {
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
