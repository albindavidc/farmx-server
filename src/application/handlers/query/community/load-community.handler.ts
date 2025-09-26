import { LoadCommunityQuery } from "@application/queries/community/load-community.query";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import { ILoadCommunity } from "@application/interfaces/query/community/load-community.interface";
import {Community} from "@domain/entities/community/community.entity";

@injectable()
export class LoadCommunityHandler implements ILoadCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(query: LoadCommunityQuery): Promise<Community> {
    return this.communityRepository.findById(query.communityId);
  }
}
