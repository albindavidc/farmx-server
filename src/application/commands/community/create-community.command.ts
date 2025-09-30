import { CreateCommunityRequestDto } from "@application/dtos/community/community-request.dto.js";
export class CreateCommunityCommand {
  constructor(public readonly dto: Partial<CreateCommunityRequestDto>) {}
}
