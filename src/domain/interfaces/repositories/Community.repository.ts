import { CommunityMembersDocument } from "../../../infrastructure/database/schemas/community-members.schema";
import { Community } from "../../entities/community.entity";

interface AddMembershipResult {
  membership: CommunityMembersDocument;
  community: Community | null;
}

export interface CommunityRepository {
  create(community: Community): Promise<Community>;
  findById(id: string): Promise<Community | null>;
  findAll(): Promise<Community[]>;
  update(id: string, community: Partial<Community>): Promise<Community | null>;
  delete(id: string): Promise<boolean>;

  addMember(communityId: string, userId: string): Promise<AddMembershipResult | null>;
  removeMember(communityId: string, userId: string): Promise<Community | null>;
}
