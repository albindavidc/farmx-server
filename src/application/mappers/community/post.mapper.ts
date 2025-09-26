import { CreatePostDto } from "@application/dtos/community/post.dto";
import { Post } from "@domain/entities/community/post.entity";
import { UpdatePostDto } from "@application/dtos/community/post.dto";
import { PostResponseDto } from "@application/dtos/community/post.dto";

export class PostMapper {
  //* ========== DTO <-> Entity ========== *//

  static dtoToEntity(dto: CreatePostDto, communityName: string): Post {
    if (!dto) {
      throw new Error("Invalid dto");
    }

    return new Post(
      dto.text,
      new Date(),
      dto.userId,
      dto.userName,
      dto.userRole,
      dto.communityId,
      communityName,
      "",
      dto.imageUrl || "",
      false,
      undefined
    );
  }

  static updateDtoToEntity(dto: UpdatePostDto, existingEntity: Post): Post {
    if (!dto || !existingEntity) {
      throw new Error("DTO and existing entity cannot be null or undefined");
    }

    return new Post(
      dto.text || existingEntity.text,
      existingEntity.createdAt,
      existingEntity.userId,
      existingEntity.userName,
      existingEntity.userRole,
      existingEntity.communityId,
      existingEntity.communityName,
      existingEntity.id,
      dto.imageUrl || existingEntity.imageUrl,
      existingEntity.isEdited,
      existingEntity.lastEditedAt
    );
  }

  static entityToDto(entity: Post): PostResponseDto {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }

    return {
      id: entity.id,
      text: entity.text,
      createdAt: entity.createdAt,
      userId: entity.userId,
      userName: entity.userName,
      userRole: entity.userRole,
      communityId: entity.communityId,
      communityName: entity.communityName,
      imageUrl: entity.imageUrl,
      isEdited: entity.isEdited,
      lastEditedAt: entity.lastEditedAt,
    };
  }


}
