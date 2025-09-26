import { injectable } from "inversify";

import { Post } from "@domain/entities/community/post.entity";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface";
import { PostModel } from "@infrastructure/database/schemas/post.schema";
import { PostPersistenceMapper } from "@infrastructure/mappers/community/post-persistence.mapper";

@injectable()
export class PostRepositoryImpl implements IPostRepository {
  async findById(id: string): Promise<Post | null> {
    try {
      const document = await PostModel.findById(id);
      return document ? PostPersistenceMapper.persistenceToEntity(document) : null;
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

    return PostPersistenceMapper.persistenceArrayToEntities(documents);
  }

  async create(post: Post): Promise<Post> {
    const persistenceData = PostPersistenceMapper.entityToPersistence(post);

    const document = new PostModel(persistenceData);   
    const saved = await document.save();

    return PostPersistenceMapper.persistenceToEntity(saved);
  
  }

  async update(post: Post): Promise<Post> {
    const updateData = PostPersistenceMapper.updateEntityToPersistence(post);

    const updated = await PostModel.findByIdAndUpdate(
      post.id,
      updateData,
      { new: true }
    ).exec();

    if (!updated) {
      throw new Error(`Post with ID ${post.id} not found`);
    }

    return PostPersistenceMapper.persistenceToEntity(updated);

   
  }

  async delete(id: string): Promise<boolean> {
    const result = await PostModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async countByCommunityId(communityId: string): Promise<number> {
    const count = await PostModel.countDocuments({ communityId }).exec();
    return count;
  }
}
