import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface";
import { IGetPost } from "@application/interfaces/query/community/post/get-post.interface";
import { PostResponseDto } from "@application/dtos/community/post.dto";

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
