import { inject, injectable } from "inversify";
import { CommandHandler } from "../interfaces/command.handler";
import { CreateCommunityCommand } from "../commands/create-community.command";
import { Community } from "../../../domain/entities/community.entity";
import { TYPES } from "../../../presentation/container/types";
import { CommunityRepository } from "../../../domain/interfaces/repositories/community.repository";

@injectable()
export class CreateCommunityHandler implements CommandHandler<CreateCommunityCommand, Community>{
    constructor(@inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository){}
}