import { inject, injectable } from "inversify";
import { PostRepository } from "../../../../../domain/interfaces/repositories/community/post.repository";
import { TYPES } from "../../../../../presentation/container/types";
import { PostResponseDto, UpdatePostDto } from "../../../dto/community/post.dto";

@injectable()
export class UpdateCommunityPostHandler {
  constructor(@inject(TYPES.PostRepository) private postRepository: PostRepository) {}

  async execute(dto: UpdatePostDto, userId: string, isAdmin: boolean): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(dto.id);
    if (!post) {
      throw new Error(`Post with ID ${dto.id} not found`);
    }

    // Check if user has permission to update this post
    if (post.userId !== userId && !isAdmin) {
      throw new Error("Not authorized to edit this post");
    }

    post.update(dto.text, dto.imageUrl);
    const updated = await this.postRepository.update(post);
    return PostResponseDto.fromEntity(updated);
  }
}
