import { injectable } from "inversify";
import { CommunityRepository } from "../../domain/interfaces/repositories/community.repository";
import { CommunityDocument, CommunityModel } from "../database/schemas/community.schema";
import mongoose from "mongoose";
import {
  CommunityMemberModel,
  CommunityMembersDocument,
} from "../database/schemas/community-members.schema";
import { Community } from "../../domain/entities/community.entity";

interface AddMembershipResult {
  membership: CommunityMembersDocument;
  community: Community | null;
}

@injectable()
export class CommunityRepositoryImpl implements CommunityRepository {
  private mapToEntity(doc: CommunityDocument): Community {
    return new Community(
      doc.name,
      doc.description,
      doc.createdBy,
      doc.id.toString(),
      doc.createdAt,
      doc.memberCount,
      doc.imageUrl,
      doc.categories
    );
  }

  async create(community: Community): Promise<Community> {
    const communityDoc = new CommunityModel({
      name: community.name,
      description: community.description,
      createdAt: community.createdAt,
      createdBy: community.createdBy,
      memberCount: community.membersCount,
      imageUrl: community.imageUrl,
      categories: community.categories,
    });

    const savedCommunity = await communityDoc.save();
    return this.mapToEntity(savedCommunity);
  }

  async findById(id: string): Promise<Community | null> {
    const community = await CommunityModel.findById(id);
    return community ? this.mapToEntity(community) : null;
  }

  async findAll(): Promise<Community[]> {
    const communities = await CommunityModel.find();
    return communities.map((community) => this.mapToEntity(community));
  }

  async update(id: string, communityData: Partial<Community>): Promise<Community | null> {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      id,
      { $set: communityData },
      { new: true }
    );
    return updatedCommunity ? this.mapToEntity(updatedCommunity) : null;
  }

  async delete(id: string): Promise<boolean> {
    const deltedCommunity = await CommunityModel.findByIdAndDelete(id);
    return !!deltedCommunity;
  }

  async addMember(communityId: string, userId: string): Promise<AddMembershipResult> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newMember = await CommunityMemberModel.create(
        [
          {
            communityId,
            userId,
            joinedAt: new Date(),
            role: "member",
            status: "active",
          },
        ],
        { session }
      );

      const updatedCommunity = await CommunityModel.findByIdAndUpdate(
        communityId,
        { $inc: { memberCount: 1 } },
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        membership: newMember[0],
        community: updatedCommunity ? this.mapToEntity(updatedCommunity) : null,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if ((error as { code?: number }).code == 11000) {
        throw new Error("User is already a member of this community");
      }
      throw error;
    }
  }

  async removeMember(communityId: string, userId: string): Promise<Community | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deleteResult = await CommunityMemberModel.deleteOne(
        {
          communityId,
          userId,
        },
        { session }
      );

      if (deleteResult.deletedCount > 0) {
        const updatedCommunity = await CommunityModel.findByIdAndUpdate(
          communityId,
          { $inc: { memberCount: -1 } },
          { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return updatedCommunity ? this.mapToEntity(updatedCommunity) : null;
      } else {
        await session.abortTransaction();
        session.endSession();
        throw new Error("User is not a member of this community");
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
