import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/container/types";
import { CommunityRepository } from "../../../../domain/interfaces/repositories/community/community.repository";
import {
  CommunitiesListResponseDto,
  CommunityResponseDto,
} from "../../dto/community/community-response.dto";
import { Types } from "mongoose";

export interface CommunityFilter {
  name?: { $regex: string; $options: string };
  categories?: { $in: string[] };
  createdBy?: string | Types.ObjectId;
}

@injectable()
export class ListCommunitiesHandler {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: CommunityRepository
  ) {}

  async execute(options?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    filter?: {
      name?: string;
      categories?: string[];
      createdBy?: string;
    };
  }): Promise<CommunitiesListResponseDto> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const sort = options?.sort || { createdAt: -1 };

    // Build filter
    const filter: CommunityFilter = {};

    if (options?.filter?.name) {
      filter.name = { $regex: options.filter.name, $options: "i" };
    }

    if (options?.filter?.categories && options.filter.categories.length > 0) {
      filter.categories = { $in: options.filter.categories };
    }

    if (options?.filter?.createdBy) {
      filter.createdBy = options.filter.createdBy;
    }

    // Execute query
    const { communities, total } = await this.communityRepository.findAllCommunities({
      page,
      limit,
      sort,
      filter,
    });

    // Map to response DTOs
    const communityDtos = communities.map((community) =>
      CommunityResponseDto.fromEntity(community.toObject())
    );

    // Return response
    return new CommunitiesListResponseDto({
      communities: communityDtos,
      total,
      page,
      limit,
    });
  }
}
