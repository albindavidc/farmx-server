import { inject, injectable } from "inversify";
import { TYPES } from "../../../../../presentation/container/types";
import { PostRepository } from "../../../../../domain/interfaces/repositories/community/post.repository";

@injectable()
export class DeleteCommunityPostHandler {
  constructor(@inject(TYPES.PostRepository) private postRepository: PostRepository) {}

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
