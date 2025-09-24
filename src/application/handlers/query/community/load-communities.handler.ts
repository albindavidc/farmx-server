import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { Community } from "@domain/entities/community/community.entity";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import { ILoadCommunities } from "@application/interfaces/query/community/load-communities.interface";

@injectable()
export class LoadCommunitiesHandler implements ILoadCommunities {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(createdById: string): Promise<Community[]> {
    return this.communityRepository.findByCreatedById(createdById);
  }
}
