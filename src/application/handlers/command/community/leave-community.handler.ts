import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { LeaveCommunityCommand } from "@application/commands/community/leave-community.command.js";
import { ILeaveCommunity } from "@application/interfaces/command/community/leave-community.interface.js";
import { Community } from "@domain/entities/community/community.entity.js";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface.js";

@injectable()
export class LeaveCommunityHandler implements ILeaveCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(command: LeaveCommunityCommand): Promise<Community | null> {
    return this.communityRepository.removeMember(command.communityId, command.userId);
  }
}
