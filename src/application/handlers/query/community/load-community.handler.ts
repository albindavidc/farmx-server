import { inject, injectable } from "inversify";

import { ILoadCommunity } from "@application/interfaces/query/community/load-community.interface.js";
import { LoadCommunityQuery } from "@application/queries/community/load-community.query.js";
import { Community } from "@domain/entities/community/community.entity.js";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface.js";
import { TYPES } from "@presentation/container/types.js";

@injectable()
export class LoadCommunityHandler implements ILoadCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(query: LoadCommunityQuery): Promise<Community | null> {
    return this.communityRepository.findById(query.communityId);
  }
}
