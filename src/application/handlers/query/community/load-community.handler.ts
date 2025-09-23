import { LoadCommunityQuery } from "@application/queries/community/load-community.query";
import { Community } from "@domain/entities/community/community.entity";
import { CommunityRepository } from "@domain/repositories/community/community.repository";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";

@injectable()
export class LoadCommunityHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async execute(query: LoadCommunityQuery): Promise<Community | null> {
    return this.communityRepository.findById(query.communityId);
  }
}
