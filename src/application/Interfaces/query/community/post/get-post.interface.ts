import { PostResponseDto } from "@application/dtos/community/post.dto";

export interface IGetPost {
  execute(id: string): Promise<PostResponseDto>;
}
