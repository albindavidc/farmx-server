import mongoose, { FilterQuery } from "mongoose";
import { Community } from "../../entities/community/community.entity";

export interface ICommunityMember {
  userId: mongoose.Types.ObjectId;
  joinedAt: Date;
  role: string;
  status: string;
}

export interface IAddMembershipResult {
  membership: ICommunityMember;
  community: Community | null;
}

export interface ICommunityRepository {
  create(community: Community): Promise<Community>;
  findById(id: string): Promise<Community | null>;
  findByCreatedById(createdById: string): Promise<Community[]>;
  findAll(): Promise<Community[]>;
  update(id: string, community: Partial<Community>): Promise<Community | null>;

  findByName(name: string): Promise<Community | null>;
  findAllCommunities(options?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    filter?: FilterQuery<Community>;
  }): Promise<{ communities: Community[]; total: number }>;

  create(community: Community): Promise<Community>;
  // update(community: Community): Promise<Community>;
  delete(id: string): Promise<boolean>;
  incrementMembersCount(id: string): Promise<boolean>;
  decrementMembersCount(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;

  addMember(communityId: string, userId: string): Promise<IAddMembershipResult | null>;
  removeMember(communityId: string, userId: string): Promise<Community | null>;
}
