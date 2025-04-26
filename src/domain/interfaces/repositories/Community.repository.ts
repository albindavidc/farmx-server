import { Community } from "../../entities/Community.entity";

export interface CommunityRepository {
  create(community: Community): Promise<Community>;
  findById(id: string): Promise<Community | null>;
  findAll(): Promise<Community[]>;
  update(id: string, community: Partial<Community>): Promise<Community | null>;
  delete(id: string): Promise<boolean>;

  addMember(communityId: string, userId: string): Promise<Community | null>;
  removeMember(communityId: string, userId: string): Promise<Community | null>;
}
