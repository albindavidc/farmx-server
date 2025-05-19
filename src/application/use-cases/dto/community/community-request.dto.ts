export class CreateCommunityRequestDto {
  name: string;
  description: string;
  createdBy: string;
  imageUrl?: string;
  categories: string[];

  constructor(
    name: string,
    description: string,
    createdBy: string,
    categories: string[],
    imageUrl?: string
  ) {
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
    this.categories = categories;
    this.imageUrl = imageUrl;
  }
}

export class AddMemberRequestDto {
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
