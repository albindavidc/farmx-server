import { Post } from "../../entities/community/post.entity";

export interface IPostRepository {
  findById(id: string): Promise<Post | null>;
  findByCommunityId(communityId: string): Promise<Post[]>;
  create(post: Post): Promise<Post>;
  update(post: Post): Promise<Post>;
  delete(id: string): Promise<boolean>;
}
