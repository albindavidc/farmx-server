import { CreateCommunityCommand } from "@application/commands/community/create-community.command.js";
import { Community } from "@domain/entities/community/community.entity.js";

export interface ICreateCommunity {
  execute(command: CreateCommunityCommand): Promise<Community>;
}