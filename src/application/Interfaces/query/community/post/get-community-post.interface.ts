import { PostResponseDto } from "@application/dtos/community/post.dto.js";

export interface IGetCommunityPosts {
  execute(communityId: string): Promise<PostResponseDto[]>;
}
