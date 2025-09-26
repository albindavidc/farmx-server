import { ICommunityDocument } from "@infrastructure/database/schemas/community.schema";
import { Community } from "@domain/entities/community/community.entity";
import { CreateCommunityRequestDto } from "@application/dtos/community/community-request.dto";
import { CommunityResponseDto } from "@application/dtos/community/community-response.dto";
import { UpdateCommunityRequestDto } from "@application/dtos/community/update-community.dto";

export class CommunityMapper {


  /* To Entity */

  static dtoToEntity(dto: CreateCommunityRequestDto): Community {
    if (!dto) {
      throw new Error("Invalid dto");
    }

    return new Community(
      dto.name,
      dto.description,
      true,
      dto.createdBy,
      undefined,
      new Date(),
      1,
      dto.imageUrl,
      dto.categories
    );
  }

  static updateDtoToEntity(dto: UpdateCommunityRequestDto, existingEntity: Community): Community {
    if (!dto || !existingEntity) {
      throw new Error("DTO and existing entity cannot be null or undefined");
    }

    return new Community(
      dto.name ?? existingEntity.getName(),
      dto.description ?? existingEntity.getDescription(),
      existingEntity.getIsActive(),
      existingEntity.getCreatedBy(),
      existingEntity.getId(),
      existingEntity.getCreatedAt(),
      existingEntity.getMembersCount(),
      dto.imageUrl ?? existingEntity.getImageUrl(),
      dto.categories ?? existingEntity.getCategories()
    );
  }

  static persistenceToEntity(persistence: ICommunityDocument): CommunityResponseDto {
    if (!persistence) {
      throw new Error("Persistence cannot be null or undefined");
    }

    return {
      id: persistence.id.toString(),
      name: persistence.name,
      description: persistence.description,
      isActive: persistence.isActive,
      createdBy: persistence.createdBy,
      createdAt: persistence.createdAt,
      membersCount: persistence.membersCount,
      imageUrl: persistence.imageUrl,
      categories: persistence.categories,
    };
  }

  /* To Persistence */

  static entityToPersistence(entity: Community): Partial<ICommunityDocument> {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }

    return {
      name: entity.getName(),
      description: entity.getDescription(),
      isActive: entity.getIsActive(),
      createdBy: entity.getCreatedBy(),
      membersCount: entity.getMembersCount(),
      imageUrl: entity.getImageUrl(),
      categories: entity.getCategories(),
    };
  }

  static updateEntityToPersistence(entity: Community): Partial<ICommunityDocument> {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }

    const updateDate: Partial<ICommunityDocument> = {};

    if (entity.getName() !== undefined) {
      updateDate.name = entity.getName();
    }

    if (entity.getDescription() !== undefined) {
      updateDate.description = entity.getDescription();
    }

    if (entity.getImageUrl() !== undefined) {
      updateDate.imageUrl = entity.getImageUrl();
    }

    if (entity.getIsActive() !== undefined) {
      updateDate.isActive = entity.getIsActive();
    }

    if (entity.getCreatedBy() !== undefined) {
      updateDate.createdBy = entity.getCreatedBy();
    }

    if (entity.getMembersCount() !== undefined) {
      updateDate.membersCount = entity.getMembersCount();
    }

    if (entity.getCategories() !== undefined) {
      updateDate.categories = entity.getCategories();
    }

    return updateDate;
  }

  /* To DTO */
  static entityToDto(entity: Community): CommunityResponseDto {
    if (!entity) {
      throw new Error("Entity cannot be null or undefined");
    }

    return {
      id: entity.getId(),
      name: entity.getName(),
      description: entity.getDescription(),
      isActive: entity.getIsActive(),
      createdBy: entity.getCreatedBy(),
      createdAt: entity.getCreatedAt(),
      membersCount: entity.getMembersCount(),
      imageUrl: entity.getImageUrl(),
      categories: entity.getCategories(),
    };
  }

  static persistenceToDto(persistence: ICommunityDocument): CommunityResponseDto {
    if (!persistence) {
      throw new Error("Persistence cannot be null or undefined");
    }

    return {
      id: persistence.id.toString(),
      name: persistence.name,
      description: persistence.description,
      isActive: persistence.isActive,
      createdBy: persistence.createdBy,
      createdAt: persistence.createdAt,
      membersCount: persistence.membersCount,
      imageUrl: persistence.imageUrl,
      categories: persistence.categories,
    };
  }

  static entitysToDtos(entities: Community[]): CommunityResponseDto[] {
    return entities.map((entity) => this.entityToDto(entity));
  }

  static persistenceToDtos(persistences: ICommunityDocument[]): CommunityResponseDto[] {
    return persistences.map((persistence) => this.persistenceToDto(persistence));
  }
}
