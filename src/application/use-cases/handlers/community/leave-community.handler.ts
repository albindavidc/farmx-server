import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/container/types";
import { CommunityRepository } from "../../../../domain/interfaces/repositories/community/community.repository";
import { LeaveCommunityCommand } from "../../commands/community/leave-community.command";
import { Community } from "../../../../domain/entities/community/community.entity";

@injectable()
export class LeaveCommunityHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async execute(command: LeaveCommunityCommand): Promise<Community | null> {
    return this.communityRepository.removeMember(command.communityId, command.userId);
  }
}
