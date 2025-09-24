import { UpdatePostDto, PostResponseDto } from "@application/dto/community/post.dto";

export interface IUpdateCommunityPost {
  execute(dto: UpdatePostDto, userId: string, isAdmin: boolean): Promise<PostResponseDto>;
}
