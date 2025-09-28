import { CommunitiesListResponseDto } from "@application/dtos/community/community-response.dto.js";

export interface IListCommunities {
  execute(options?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    filter?: {
      name?: string;
      categories?: string[];
      createdBy?: string;
    };
  }): Promise<CommunitiesListResponseDto>;
}
