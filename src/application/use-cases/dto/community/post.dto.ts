import { Post } from "../../../../domain/entities/community/post.entity";
import { UserPostRole } from "../../../../domain/enums/user-role.enum";

export class CreatePostDto {
  text!: string;
  communityId!: string;
  userId!: string;
  userName!: string;
  userRole!: UserPostRole;
  imageUrl?: string;
}

export class UpdatePostDto {
  _id!: string;
  text!: string;
  imageUrl?: string;
}

export class PostResponseDto {
  text!: string;
  imageUrl?: string;
  createdAt!: Date;
  userId!: string;
  userName!: string;
  userRole!: UserPostRole;
  communityId!: string;
  communityName?: string;
  isEdited!: boolean;

  lastEditedAt?: Date;
  id?: string;

  static fromEntity(post: Post): PostResponseDto {
    const dto = new PostResponseDto();
    dto.text = post.text;
    dto.imageUrl = post.imageUrl;
    dto.createdAt = post.createdAt;
    dto.userId = post.userId;
    dto.userName = post.userName;
    dto.userRole = post.userRole;
    dto.communityId = post.communityId;
    dto.communityName = post.communityName;
    dto.isEdited = post.isEdited || false;

    dto.lastEditedAt = post.lastEditedAt;
    dto.id = post._id;

    return dto;
  }
}
