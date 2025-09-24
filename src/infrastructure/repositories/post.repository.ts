import { injectable } from "inversify";

import { Post } from "@domain/entities/community/post.entity";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface";
import { IPostDocument, PostModel } from "@infrastructure/database/schemas/post.schema";

@injectable()
export class PostRepositoryImpl implements IPostRepository {
  private mapToEntity(document: IPostDocument): Post {
    return new Post(
      document._id.toString(),
      document.text,
      document.createdAt,
      document.userId,
      document.userName,
      document.userRole,
      document.communityId,
      document.communityName,
      document.imageUrl || "",
      document.isEdited,
      document.lastEditedAt
    );
  }

  async findById(id: string): Promise<Post | null> {
    try {
      const document = await PostModel.findById(id);
      return document ? this.mapToEntity(document) : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find post by ID: ${error.message}`);
      }
      throw new Error("Failed to find post by ID: Unknow error occured");
    }
  }

  async findByCommunityId(communityId: string): Promise<Post[]> {
    const documents = await PostModel.find({ communityId })
      .sort({ createdAt: -1 }) // Latest first
      .exec();

    return documents.map(
      (doc) =>
        new Post(
          doc._id.toString(),
          doc.text,
          doc.createdAt,
          doc.userId,
          doc.userName,
          doc.userRole,
          doc.communityId,
          doc.communityName,
          doc.imageUrl,
          doc.isEdited,
          doc.lastEditedAt
        )
    );
  }

  async create(post: Post): Promise<Post> {
    const document = new PostModel({
      text: post.text,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      userId: post.userId,
      userName: post.userName,
      userRole: post.userRole,
      communityId: post.communityId,
      communityName: post.communityName,
    });

    const saved = await document.save();

    return new Post(
      saved._id,
      saved.text,
      saved.createdAt,
      saved.userId,
      saved.userName,
      saved.userRole,
      saved.communityId,
      saved.communityName,
      saved.imageUrl,
      saved.isEdited,
      saved.lastEditedAt
    );
  }

  async update(post: Post): Promise<Post> {
    const updated = await PostModel.findByIdAndUpdate(
      post._id,
      {
        text: post.text,
        imageUrl: post.imageUrl,
        isEdited: post.isEdited,
        lastEditedAt: post.lastEditedAt,
      },
      { new: true }
    ).exec();

    if (!updated) {
      throw new Error(`Post with ID ${post._id} not found`);
    }

    return new Post(
      updated._id,
      updated.text,
      updated.createdAt,
      updated.userId,
      updated.userName,
      updated.userRole,
      updated.communityId,
      updated.communityName,
      updated.imageUrl,
      updated.isEdited,
      updated.lastEditedAt
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await PostModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
