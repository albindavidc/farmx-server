import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { ILoadCommunities } from "@application/interfaces/query/community/load-communities.interface.js";
import { Community } from "@domain/entities/community/community.entity.js";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface.js";

@injectable()
export class LoadCommunitiesHandler implements ILoadCommunities {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(createdById: string): Promise<Community[]> {
    return this.communityRepository.findByCreatedById(createdById);
  }
}
