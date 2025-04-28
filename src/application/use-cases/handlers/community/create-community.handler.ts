import { inject, injectable } from "inversify";
import { CommandHandler } from "../../interfaces/command.interface";
import { CreateCommunityCommand } from "../../commands/community/create-community.command";
import { Community } from "../../../../domain/entities/community/community.entity";
import { TYPES } from "../../../../presentation/container/types";
import { CommunityRepository } from "../../../../domain/interfaces/repositories/community/community.repository";

@injectable()
export class CreateCommunityHandler implements CommandHandler<CreateCommunityCommand, Community> {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}
  async execute(command: CreateCommunityCommand): Promise<Community> {
    const community = new Community(
      command.name,
      command.description,
      command.createdBy,
      "",
      new Date(),
      1,
      command.imageUrl,
      command.categories
    );
    return await this.communityRepository.create(community);
  }
}
