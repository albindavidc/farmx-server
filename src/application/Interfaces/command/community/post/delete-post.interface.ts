export interface IDeleteCommunityPost {
  execute(postId: string, userId: string, isAdmin: boolean): Promise<void>;
}
