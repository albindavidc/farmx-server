import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { IDeleteCommunityPost } from "@application/interfaces/command/community/post/delete-post.interface.js";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface.js";

@injectable()
export class DeleteCommunityPostHandler implements IDeleteCommunityPost {
  constructor(@inject(TYPES.PostRepository) private postRepository: IPostRepository) {}

  async execute(postId: string, userId: string, isAdmin: boolean): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    // Check if user has permission to delete this post
    if (post.userId !== userId && !isAdmin) {
      throw new Error("Not authorized to delete this post");
    }

    const success = await this.postRepository.delete(postId);
    if (!success) {
      throw new Error(`Failed to delete post with ID ${postId}`);
    }
  }
}
