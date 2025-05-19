import { injectable } from "inversify";
import {
  AddMembershipResult,
  CommunityRepository,
} from "../../domain/interfaces/repositories/community/community.repository";
import { CommunityDocument, CommunityModel } from "../database/schemas/community.schema";
import mongoose, { FilterQuery, Types } from "mongoose";
import { CommunityMemberModel } from "../database/schemas/community-members.schema";
import { Community } from "../../domain/entities/community/community.entity";

@injectable()
export class CommunityRepositoryImpl implements CommunityRepository {
  private mapToEntity(doc: CommunityDocument): Community {
    
    return new Community(
      doc.name,
      doc.description,
      doc.createdBy,
      doc.id,
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

  async findByName(name: string): Promise<Community | null> {
    try {
      const document = await CommunityModel.findOne({ name }).exec();
      return document ? this.mapToEntity(document) : null;
    } catch (error) {
      console.error("Error finding community by name:", error);
      return null;
    }
  }

  async findAll(): Promise<Community[]> {
    const communities = await CommunityModel.find();
    return communities.map((community) => this.mapToEntity(community));
  }

  async findAllCommunities(options?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    filter?: FilterQuery<Community>;
  }): Promise<{ communities: Community[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const sort = options?.sort || { createdAt: -1 };
    const filter: FilterQuery<Community> = options?.filter || {};

    try {
      const [documents, total] = await Promise.all([
        CommunityModel.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
        CommunityModel.countDocuments(filter).exec(),
      ]);

      const communities = documents.map((doc) => this.mapToEntity(doc));
      return { communities, total };
    } catch (error) {
      console.error("Error finding all communities:", error);
      throw new Error("Failed to fetch communities");
    }
  }

  // async update(id: string, communityData: Partial<Community>): Promise<Community | null> {
  //   const updatedCommunity = await CommunityModel.findByIdAndUpdate(
  //     id,
  //     { $set: communityData },
  //     { new: true }
  //   );
  //   return updatedCommunity ? this.mapToEntity(updatedCommunity) : null;
  // }

  async update(community: Community): Promise<Community> {
    try {
      const document = await CommunityModel.findByIdAndUpdate(
        community.id,
        {
          name: community.name,
          description: community.description,
          createdBy: community.createdBy,
          createdAt: community.createdAt,
          membersCount: community.membersCount,
          imageUrl: community.imageUrl,
          categories: community.categories,
        },
        { new: true, runValidators: true }
      ).exec();

      if (!document) {
        throw new Error("Community not found");
      }

      return this.mapToEntity(document);
    } catch (error) {
      console.error("Error updating community:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const deltedCommunity = await CommunityModel.findByIdAndDelete(id);
    return !!deltedCommunity;
  }

  async incrementMembersCount(id: string): Promise<boolean> {
    try {
      const result = await CommunityModel.updateOne(
        { _id: new Types.ObjectId(id) },
        { $inc: { membersCount: 1 } }
      ).exec();
      return result.modifiedCount === 1;
    } catch (error) {
      console.error("Error incrementing members count:", error);
      return false;
    }
  }

  async decrementMembersCount(id: string): Promise<boolean> {
    try {
      const result = await CommunityModel.updateOne(
        { _id: new Types.ObjectId(id), membersCount: { $gt: 0 } },
        { $inc: { membersCount: -1 } }
      ).exec();
      return result.modifiedCount === 1;
    } catch (error) {
      console.error("Error decrementing members count:", error);
      return false;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const exists = await CommunityModel.exists({ _id: id }).exec();
      return !!exists;
    } catch (error) {
      console.error("Error checking if community exists:", error);
      return false;
    }
  }

  async addMember(communityId: string, userId: string): Promise<AddMembershipResult | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find or create the CommunityMemberModel document for the community
      let communityMemberDoc = await CommunityMemberModel.findOne({ communityId }, null, {
        session,
      });

      if (!communityMemberDoc) {
        const [newDoc] = await CommunityMemberModel.create(
          [
            {
              communityId,
              members: [
                {
                  userId,
                  joinedAt: new Date(),
                  role: "member",
                  status: "active",
                },
              ],
            },
          ],
          { session }
        );
        communityMemberDoc = newDoc;
      } else {
        communityMemberDoc = await CommunityMemberModel.findOneAndUpdate(
          { communityId, "members.userId": { $ne: userId } },
          {
            $push: {
              members: {
                userId,
                joinedAt: new Date(),
                role: "member",
                status: "active",
              },
            },
          },
          { new: true, session }
        );

        if (!communityMemberDoc) {
          throw new Error("User is already a member of this community");
        }
        if (!communityMemberDoc.members.some((member) => member.userId.toString() === userId)) {
          throw new Error("User is already a member of this community");
        }
      }

      const updatedCommunity = await CommunityModel.findByIdAndUpdate(
        communityId,
        { $inc: { memberCount: 1 } },
        { new: true, session }
      );
      if (!updatedCommunity) {
        throw new Error("Community not found");
      }

      await session.commitTransaction();
      session.endSession();

      const newMember = communityMemberDoc.members.find(
        (member) => member.userId.toString() === userId
      );

      if (!newMember) {
        throw new Error("Failed to find the newl added member");
      }
      return {
        membership: {
          userId: newMember.userId,
          joinedAt: newMember.joinedAt,
          role: newMember.role,
          status: newMember.status,
        },
        community: updatedCommunity ? this.mapToEntity(updatedCommunity) : null,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if ((error as { code?: number }).code === 11000) {
        throw new Error("User is already a member of this community");
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  async removeMember(communityId: string, userId: string): Promise<Community | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedCommunityMember = await CommunityMemberModel.findOneAndUpdate(
        { communityId },
        {
          $pull: { members: { userId } },
        },
        { new: true, session }
      );

      if (
        !updatedCommunityMember ||
        !updatedCommunityMember.members.some((member) => member.userId.toString() === userId)
      ) {
        await session.abortTransaction();
        session.endSession();
        throw new Error("User is not a member of this community");
      }

      const updatedCommunity = await CommunityModel.findByIdAndUpdate(
        communityId,
        { $inc: { memberCount: -1 } },
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return updatedCommunity ? this.mapToEntity(updatedCommunity) : null;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
