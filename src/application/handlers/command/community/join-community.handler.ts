import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { JoinCommunityCommand } from "@application/commands/community/join-community-command.js";
import { IJoinCommunity } from "@application/interfaces/command/community/join-community.interface.js";
import { Community } from "@domain/entities/community/community.entity.js";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface.js";

@injectable()
export class JoinCommunityHandler implements IJoinCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(command: JoinCommunityCommand): Promise<Community> {
    const result = await this.communityRepository.addMember(command.communityId, command.userId);

    if (!result?.community) {
      throw new Error("The community is not created");
    }

    return result?.community;
  }
}
