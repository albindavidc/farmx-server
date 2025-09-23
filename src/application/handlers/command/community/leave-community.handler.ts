import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { Community } from "@domain/entities/community/community.entity";
import { CommunityRepository } from "@domain/repositories/community/community.repository";
import { LeaveCommunityCommand } from "@application/commands/community/leave-community.command";

@injectable()
export class LeaveCommunityHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async execute(command: LeaveCommunityCommand): Promise<Community | null> {
    return this.communityRepository.removeMember(command.communityId, command.userId);
  }
}
