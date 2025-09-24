import { CreatePostDto, PostResponseDto } from "@application/dto/community/post.dto";

export interface ICreateCommunityPost {
  execute(dto: CreatePostDto): Promise<PostResponseDto>;
}
