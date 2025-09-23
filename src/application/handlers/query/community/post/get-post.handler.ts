import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { PostRepository } from "@domain/repositories/community/post.repository";
import { PostResponseDto } from "@application/dto/community/post.dto";

@injectable()
export class GetCommunityPostQueryHandler {
  constructor(@inject(TYPES.PostRepository) private postRepository: PostRepository) {}

  async execute(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error(`Post with ID ${id} not found`);
    }
    return PostResponseDto.fromEntity(post);
  }
}
