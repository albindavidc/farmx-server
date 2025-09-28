import { Community } from "@domain/entities/community/community.entity.js";

export interface ILoadCommunities {
  execute(createdById: string): Promise<Community[]>;
}
