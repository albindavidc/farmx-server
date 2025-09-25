// Community Response DTO
export class CommunityResponseDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  membersCount: number;
  imageUrl?: string;
  categories?: string[];

  constructor(data: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    membersCount: number;
    imageUrl?: string;
    categories: string[];
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.isActive = data.isActive;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
    this.membersCount = data.membersCount;
    this.imageUrl = data.imageUrl;
    this.categories = data.categories;
  }

  static fromEntity(community: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    membersCount: number;
    imageUrl?: string;
    categories: string[];
  }): CommunityResponseDto {
    return new CommunityResponseDto({
      id: community.id,
      name: community.name,
      description: community.description,
      isActive: community.isActive,
      createdBy: community.createdBy,
      createdAt: community.createdAt,
      membersCount: community.membersCount,
      imageUrl: community.imageUrl,
      categories: community.categories,
    });
  }
}

// Communities List Response DTO with pagination
export class CommunitiesListResponseDto {
  communities: CommunityResponseDto[];
  total: number;
  page: number;
  limit: number;

  constructor(data: {
    communities: CommunityResponseDto[];
    total: number;
    page: number;
    limit: number;
  }) {
    this.communities = data.communities;
    this.total = data.total;
    this.page = data.page;
    this.limit = data.limit;
  }
}
