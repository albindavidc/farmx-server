import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { CommunityRepository } from "@domain/repositories/community/community.repository";
import { Community } from "@domain/entities/community/community.entity";

@injectable()
export class LoadCommunitiesHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async execute(createdById: string): Promise<Community[]> {
    return this.communityRepository.findByCreatedById(createdById);
  }
}
