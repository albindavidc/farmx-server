import { PostResponseDto } from "@application/dtos/community/post.dto";
import { IGetCommunityPosts } from "@application/interfaces/query/community/post/get-community-post.interface";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import { IPostRepository } from "@domain/interfaces/community/post-repository.interface";
import { TYPES } from "@presentation/container/types";
import { inject, injectable } from "inversify";

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
