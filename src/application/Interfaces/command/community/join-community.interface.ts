import { JoinCommunityCommand } from "@application/commands/community/join-community-command";
import { Community } from "@domain/entities/community/community.entity";

export interface IJoinCommunity {
  execute(command: JoinCommunityCommand): Promise<Community | null>;
}
