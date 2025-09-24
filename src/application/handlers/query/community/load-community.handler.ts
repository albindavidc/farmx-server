import { LoadCommunityQuery } from "@application/queries/community/load-community.query";
import { Community } from "@domain/entities/community/community.entity";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import { ILoadCommunity } from "@application/interfaces/query/community/load-community.interface";

@injectable()
export class LoadCommunityHandler implements ILoadCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(query: LoadCommunityQuery): Promise<Community | null> {
    return this.communityRepository.findById(query.communityId);
  }
}
