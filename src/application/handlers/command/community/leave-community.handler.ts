import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { Community } from "@domain/entities/community/community.entity";
import { LeaveCommunityCommand } from "@application/commands/community/leave-community.command";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import { ILeaveCommunity } from "@application/interfaces/command/community/leave-community.interface";

@injectable()
export class LeaveCommunityHandler implements ILeaveCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(command: LeaveCommunityCommand): Promise<Community> {
    return this.communityRepository.removeMember(command.communityId, command.userId);
  }
}
