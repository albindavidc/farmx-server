import { CreateCommunityRequestDto } from "@application/dtos/community/community-request.dto.js";
import { CommunityResponseDto } from "@application/dtos/community/community-response.dto.js";
import { UpdateCommunityRequestDto } from "@application/dtos/community/update-community.dto.js";
import { Community } from "@domain/entities/community/community.entity.js";

export class CommunityMapper {
  //* ========== To Entity ========== *//

  static dtoToEntity(dto: Partial<CreateCommunityRequestDto>): Community {
    if (!dto.name || !dto.description || !dto.createdBy) {
      throw new Error("Invalid dto");
    }

    return new Community(
      dto.name,
      dto.description,
      true,
      dto.createdBy,
      new Date(),
      1,
      undefined,
      dto.imageUrl,
      dto.categories
    );
  }

  static updateDtoToEntity(dto: UpdateCommunityRequestDto, existingEntity: Community): Community {
    if (!dto || !existingEntity) {
      throw new Error("DTO and existing entity cannot be null or undefined");
    }

    return new Community(
      dto.name ?? existingEntity.name,
      dto.description ?? existingEntity.description,
      existingEntity.isActive,
      existingEntity.createdBy,
      existingEntity.createdAt,
      existingEntity.membersCount,
      existingEntity.id,
      dto.imageUrl ?? existingEntity.imageUrl,
      dto.categories ?? existingEntity.categories
    );
  }

  //* ========== To DTO ========== *//

  static entityToDto(entity: Community | null): CommunityResponseDto {
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
      id: entity.id,
      imageUrl: entity.imageUrl,
      categories: entity.categories,
    };
  }

  static entitiesToDtos(entities: Community[]): CommunityResponseDto[] {
    return entities.map((entity) => this.entityToDto(entity));
  }
}
