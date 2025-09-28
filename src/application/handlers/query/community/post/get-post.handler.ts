import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { PostResponseDto } from "@application/dtos/community/post.dto.js";
import { IGetPost } from "@application/interfaces/query/community/post/get-post.interface.js";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface.js";

@injectable()
export class GetCommunityPostQueryHandler implements IGetPost {
  constructor(@inject(TYPES.PostRepository) private postRepository: IPostRepository) {}

  async execute(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error(`Post with ID ${id} not found`);
    }
    return PostResponseDto.fromEntity(post);
  }
}
