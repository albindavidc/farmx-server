import {CreateCommunityCommand} from "@application/commands/community/create-community.command";
import {Community} from "@domain/entities/community/community.entity";

export interface ICreateCommunity {
  execute(command: CreateCommunityCommand): Promise<Community>;
}