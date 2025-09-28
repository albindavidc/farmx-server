import { PostResponseDto } from "@application/dtos/community/post.dto.js";

export interface IGetPost {
  execute(id: string): Promise<PostResponseDto>;
}
