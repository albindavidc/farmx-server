import { CreatePostDto } from "@application/dtos/community/post.dto";
import { Post } from "@domain/entities/community/post.entity";
import { UpdatePostDto } from "@application/dtos/community/post.dto";
import { IPostDocument } from "@infrastructure/database/schemas/post.schema";
import { PostResponseDto } from "@application/dtos/community/post.dto";

export class postMapper {
  //* ========== DTO <-> Entity ========== *//

  static dtoToEntity(dto: CreatePostDto, communityName: string): Post {
    if (!dto) {
      throw new Error("Invalid dto");
    }

    return new Post(
      "",
      dto.text,
      new Date(),
      dto.userId,
      dto.userName,
      dto.userRole,
      dto.communityId,
      communityName,
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
      existingEntity.id,
      dto.text || existingEntity.text,
      existingEntity.createdAt,
      existingEntity.userId,
      existingEntity.userName,
      existingEntity.userRole,
      existingEntity.communityId,
      existingEntity.communityName,
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

  //* ========== Persistence <-> Entity ========== *//

  static persistenceToEntity(persistence: IPostDocument): Post {
    if (!persistence) {
      throw new Error("Persistence cannot be null or undefined");
    }

    return new Post(
      persistence._id?.toString(),
      persistence.text,
      persistence.createdAt,
      persistence.userId,
      persistence.userName,
      persistence.userRole,
      persistence.communityId,
      persistence.communityName,
      persistence.imageUrl,
      persistence.isEdited,
      persistence.lastEditedAt
    );
  }

  static entityToPersistence(entity: Post): Partial<IPostDocument> {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }

    return {
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

  static updateEntityToPersistence(entity: Post): Partial<IPostDocument> {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }

    return {
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

  static persistenceToDto(persistence: IPostDocument): PostResponseDto {
    if (!persistence) {
      throw new Error("Persistence cannot be null or undefined");
    }

    return {
      id: persistence._id?.toString(),
      text: persistence.text,
      createdAt: persistence.createdAt,
      userId: persistence.userId,
      userName: persistence.userName,
      userRole: persistence.userRole,
      communityId: persistence.communityId,
      communityName: persistence.communityName,
      imageUrl: persistence.imageUrl,
      isEdited: persistence.isEdited,
      lastEditedAt: persistence.lastEditedAt,
    };
  }
}
