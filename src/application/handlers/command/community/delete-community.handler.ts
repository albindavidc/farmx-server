import { injectable, inject } from "inversify";
import { TYPES } from "@presentation/container/types";
import { DeleteCommunityCommand } from "@application/commands/community/delete-community.command";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import { IDeleteCommunity } from "@application/interfaces/command/community/delete-community.interface";

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
