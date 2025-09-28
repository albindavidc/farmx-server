import { LeaveCommunityCommand } from "@application/commands/community/leave-community.command.js";
import { Community } from "@domain/entities/community/community.entity.js";

export interface ILeaveCommunity {
  execute(command: LeaveCommunityCommand): Promise<Community | null>;
}
