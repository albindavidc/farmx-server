import { LeaveCommunityCommand } from "@application/commands/community/leave-community.command";
import { Community } from "@domain/entities/community/community.entity";

export interface ILeaveCommunity {
  execute(command: LeaveCommunityCommand): Promise<Community>;
}
