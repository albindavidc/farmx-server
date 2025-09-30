import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { CreateCommunityCommand } from "@application/commands/community/create-community.command.js";
import { ICreateCommunity } from "@application/interfaces/command/community/create-community.interface.js";
import { Community } from "@domain/entities/community/community.entity.js";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface.js";
import { CommunityMapper } from "@application/mappers/community/community.mapper.js";

@injectable()
export class CreateCommunityHandler implements ICreateCommunity {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}
  async execute(command: CreateCommunityCommand): Promise<Community> {
    const { dto } = command;

    const communityMapper = CommunityMapper.dtoToEntity(dto);

    const result = await this.communityRepository.create(communityMapper);

    return result;
  }
}
