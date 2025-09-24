import { PostResponseDto } from "@application/dtos/community/post.dto";

export interface IGetCommunityPosts {
  execute(communityId: string): Promise<PostResponseDto[]>;
}
