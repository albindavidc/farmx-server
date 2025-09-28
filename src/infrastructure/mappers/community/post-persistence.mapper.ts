import { Post } from "@domain/entities/community/post.entity.js";
import { IPostDocument } from "@infrastructure/database/schemas/post.schema.js";

export class PostPersistenceMapper {
  //* ========== Persistence <-> Entity ========== *//

  static persistenceToEntity(persistence: IPostDocument): Post {
    if (!persistence) {
      throw new Error("Persistence cannot be null or undefined");
    }

    return new Post(
      persistence.text,
      persistence.createdAt,
      persistence.userId,
      persistence.userName,
      persistence.userRole,
      persistence.communityId,
      persistence.communityName,
      persistence._id?.toString(),
      persistence.imageUrl,
      persistence.isEdited,
      persistence.lastEditedAt
    );
  }

  static persistenceArrayToEntities(persistences: IPostDocument[]): Post[] {
    return persistences.map((persistence) => this.persistenceToEntity(persistence));
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

  static persistenceToDto(persistence: IPostDocument): Post {
    if (!persistence) {
      throw new Error("Persistence cannot be null or undefined");
    }

    return new Post(
      persistence.text,
      persistence.createdAt,
      persistence.userId,
      persistence.userName,
      persistence.userRole,
      persistence.communityId,
      persistence.communityName,
      persistence._id?.toString(),
      persistence.imageUrl,
      persistence.isEdited,
      persistence.lastEditedAt
    );
  }
}
