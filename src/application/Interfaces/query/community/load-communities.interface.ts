import { Community } from "@domain/entities/community/community.entity";

export interface ILoadCommunities {
  execute(createdById: string): Promise<Community[]>;
}
