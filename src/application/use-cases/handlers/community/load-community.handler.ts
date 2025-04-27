import { inject, injectable } from "inversify";
import { CommunityRepository } from "../../../../domain/interfaces/repositories/community.repository";
import { TYPES } from "../../../../presentation/container/types";
import { LoadCommunityQuery } from "../../queries/community/load-community.query";
import { Community } from "../../../../domain/entities/community.entity";

@injectable()
export class LoadCommunityHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async execute(query: LoadCommunityQuery): Promise<Community | null> {
    return this.communityRepository.findById(query.communityId);
  }
}
