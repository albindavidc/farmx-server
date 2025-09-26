import { Community } from "@domain/entities/community/community.entity";
import { ICommunityDocument } from "@infrastructure/database/schemas/community.schema";

export class CommunityPersistenceMapper {
  //* ========== * To Entity * ========== *//
  static persistenceToEntity(persistence: ICommunityDocument): Community {
    if (!persistence) {
      throw new Error("Persistence cannot be null or undefined");
    }

    return new Community(
      persistence.name,
      persistence.description,
      persistence.isActive,
      persistence.createdBy,
      persistence.createdAt,
      persistence.membersCount,
      persistence.id.toString(),
      persistence.imageUrl,
      persistence.categories
    );
  }

  //* ========== * To Persistence * ========== *//

  static entityToPersistence(entity: Community): Partial<Community> {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }

    return {
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      membersCount: entity.membersCount,
      imageUrl: entity.imageUrl,
      categories: entity.categories,
    };
  }

  static updateEntityToPersistence(entity: Community): Partial<ICommunityDocument> {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }

    const updateDate: Partial<ICommunityDocument> = {};

    if (entity.name !== undefined) {
      updateDate.name = entity.name;
    }

    if (entity.description !== undefined) {
      updateDate.description = entity.description;
    }

    if (entity.isActive !== undefined) {
      updateDate.isActive = entity.isActive;
    }

    if (entity.createdBy !== undefined) {
      updateDate.createdBy = entity.createdBy;
    }

    if (entity.createdAt !== undefined) {
      updateDate.createdAt = entity.createdAt;
    }

    if (entity.membersCount !== undefined) {
      updateDate.membersCount = entity.membersCount;
    }

    if (entity.imageUrl !== undefined) {
      updateDate.imageUrl = entity.imageUrl;
    }

    if (entity.categories !== undefined) {
      updateDate.categories = entity.categories;
    }

    return updateDate;
  }

  //* ========== * To Dto * ========== *//

  static persistenceToDto(persistence: ICommunityDocument): Community {
    if (!persistence) {
      throw new Error("Persistence cannot be null or undefined");
    }

    return new Community(
      persistence.name,
      persistence.description,
      persistence.isActive,
      persistence.createdBy,
      persistence.createdAt,
      persistence.membersCount,
      persistence.id.toString(),
      persistence.imageUrl,
      persistence.categories
    );
  }
  static persistenceToDtos(persistences: ICommunityDocument[]): Community[] {
    return persistences.map((persistence) => this.persistenceToDto(persistence));
  }
}
