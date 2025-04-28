import { inject, injectable } from "inversify";
import { TYPES } from "../../../../../presentation/container/types";
import { PostRepository } from "../../../../../domain/interfaces/repositories/community/post.repository";
import { CommunityRepository } from "../../../../../domain/interfaces/repositories/community/community.repository";
import { PostResponseDto } from "../../../dto/community/post.dto";

@injectable()
export class GetCommunityPostsQueryHandler {
  constructor(
    @inject(TYPES.PostRepository) private postRepository: PostRepository,
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
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
