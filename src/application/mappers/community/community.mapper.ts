import { Community } from "@domain/entities/community/community.entity";
import { CreateCommunityRequestDto } from "@application/dtos/community/community-request.dto";
import { CommunityResponseDto } from "@application/dtos/community/community-response.dto";
import { UpdateCommunityRequestDto } from "@application/dtos/community/update-community.dto";

export class CommunityMapper {
  //* ========== * To Entity * ========== *//

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

  //* ========== * To DTO * ========== *//

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

  static entitysToDtos(entities: Community[]): CommunityResponseDto[] {
    return entities.map((entity) => this.entityToDto(entity));
  }
}
