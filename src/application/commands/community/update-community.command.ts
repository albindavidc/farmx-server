import { UpdateCommunityRequestDto } from "@application/dtos/community/update-community.dto.js";

export class UpdateCommunityCommand {
  constructor(public readonly id: string, public readonly data: UpdateCommunityRequestDto) {}
}
