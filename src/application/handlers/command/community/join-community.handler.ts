import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { Community } from "@domain/entities/community/community.entity";
import { CommunityRepository } from "@domain/repositories/community/community.repository";
import { JoinCommunityCommand } from "@application/commands/community/join-community-command";

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
