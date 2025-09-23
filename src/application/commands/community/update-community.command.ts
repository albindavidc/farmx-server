import { UpdateCommunityRequestDto } from "../../dto/community/update-community.dto";

export class UpdateCommunityCommand {
  constructor(public readonly id: string, public readonly data: UpdateCommunityRequestDto) {}
}
