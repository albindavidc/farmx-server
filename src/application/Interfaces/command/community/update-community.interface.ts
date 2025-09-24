import { UpdateCommunityCommand } from "@application/commands/community/update-community.command";
import { CommunityResponseDto } from "@application/dtos/community/community-response.dto";

export interface IUpdateCommunity {
  execute(command: UpdateCommunityCommand): Promise<CommunityResponseDto | null>;
}
