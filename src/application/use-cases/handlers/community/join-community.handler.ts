import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/container/types";
import { CommunityRepository } from "../../../../domain/interfaces/repositories/community/community.repository";
import { JoinCommunityCommand } from "../../commands/community/join-community-command";
import { Community } from "../../../../domain/entities/community/community.entity";

@injectable()
export class JoinCommunityHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async execute(command: JoinCommunityCommand): Promise<Community | null> {
    const result = await this.communityRepository.addMember(command.communityId, command.userId);

    if (!result?.community) {
      throw new Error("The community is not created");
    }

    return result?.community;
  }
}
