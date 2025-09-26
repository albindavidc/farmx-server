import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { Community } from "@domain/entities/community/community.entity";
import { JoinCommunityCommand } from "@application/commands/community/join-community-command";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import { IJoinCommunity } from "@application/interfaces/command/community/join-community.interface";

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
