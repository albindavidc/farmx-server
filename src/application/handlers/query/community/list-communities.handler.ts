import { inject, injectable } from "inversify";

import { TYPES } from "@presentation/container/types";
import { Types } from "mongoose";
import { ICommunityRepository } from "@domain/interfaces/community/community-repository.interface";
import {
  CommunitiesListResponseDto,
} from "@application/dtos/community/community-response.dto";
import { IListCommunities } from "@application/interfaces/query/community/list-communities.interface";

export interface ICommunityFilter {
  name?: { $regex: string; $options: string };
  categories?: { $in: string[] };
  createdBy?: string | Types.ObjectId;
}

@injectable()
export class ListCommunitiesHandler implements IListCommunities {
  constructor(
    @inject(TYPES.CommunityRepository) private communityRepository: ICommunityRepository
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
    const filter: ICommunityFilter = {};

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

    // // Map to response DTOs
    // const communityDtos = communities.map((community) =>
    //   CommunityResponseDto.fromEntity(community.toObject())
    // );

    // Return response
    return new CommunitiesListResponseDto({
      communities: communities,
      total,
      page,
      limit,
    });
  }
}
