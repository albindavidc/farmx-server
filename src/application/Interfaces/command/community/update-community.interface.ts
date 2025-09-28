import { UpdateCommunityCommand } from "@application/commands/community/update-community.command.js";
import { CommunityResponseDto } from "@application/dtos/community/community-response.dto.js";

export interface IUpdateCommunity {
  execute(command: UpdateCommunityCommand): Promise<CommunityResponseDto | null>;
}
