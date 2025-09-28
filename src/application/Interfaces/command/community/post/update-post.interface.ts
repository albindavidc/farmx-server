import { PostResponseDto, UpdatePostDto } from "@application/dtos/community/post.dto.js";

export interface IUpdateCommunityPost {
  execute(dto: UpdatePostDto, userId: string, isAdmin: boolean): Promise<PostResponseDto>;
}
