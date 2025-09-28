import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types.js";
import { PostResponseDto } from "@application/dtos/community/post.dto.js";
import { IGetCommunityPosts } from "@application/interfaces/query/community/post/get-community-post.interface.js";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface.js";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface.js";

@injectable()
export class GetCommunityPostsQueryHandler implements IGetCommunityPosts {
  constructor(
    @inject(TYPES.PostRepository) private postRepository: IPostRepository,
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
  ) {}

  async execute(communityId: string): Promise<PostResponseDto[]> {
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      throw new Error(`Community with ID ${communityId} not found`);
    }

    const posts = await this.postRepository.findByCommunityId(communityId);
    return posts.map((post) => PostResponseDto.fromEntity(post));
  }
}
