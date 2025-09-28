import { Community } from "@domain/entities/community/community.entity.js";

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
}

// Communities List Response DTO with pagination
export class CommunitiesListResponseDto {
  communities: Community[];
  total: number;
  page: number;
  limit: number;

  constructor(data: { communities: Community[]; total: number; page: number; limit: number }) {
    this.communities = data.communities;
    this.total = data.total;
    this.page = data.page;
    this.limit = data.limit;
  }
}
