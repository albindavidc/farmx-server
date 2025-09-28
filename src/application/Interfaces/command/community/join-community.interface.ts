import { JoinCommunityCommand } from "@application/commands/community/join-community-command.js";
import { Community } from "@domain/entities/community/community.entity.js";

export interface IJoinCommunity {
  execute(command: JoinCommunityCommand): Promise<Community | null>;
}
