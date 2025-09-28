import { CreatePostDto, PostResponseDto } from "@application/dtos/community/post.dto.js";

export interface ICreateCommunityPost {
  execute(dto: CreatePostDto): Promise<PostResponseDto>;
}
