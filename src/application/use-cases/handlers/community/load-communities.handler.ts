import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/container/types";
import { CommunityRepository } from "../../../../domain/interfaces/repositories/community.repository";
import { Community } from "../../../../domain/entities/community.entity";

@injectable()
export class LoadCommunitiesHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async execute(): Promise<Community[]> {
    return this.communityRepository.findAll();
  }
}
