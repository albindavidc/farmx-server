export class Community {
  private id?: string;
  private name: string;
  private description: string;
  private isActive: boolean;
  private createdBy: string;
  private createdAt: Date;
  private membersCount: number;
  private imageUrl?: string;
  private categories: string[];

  constructor(
    name: string,
    description: string,
    isActive: boolean,
    createdBy: string,
    id?: string,
    createdAt: Date = new Date(),
    membersCount: number = 1,
    imageUrl?: string,
    categories: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.membersCount = membersCount;
    this.imageUrl = imageUrl;
    this.categories = categories;
  }

  // Getters
  getId(): string {
    return this.id ?? "";
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedBy(): string {
    return this.createdBy;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getMemberCount(): number {
    return this.membersCount;
  }

  getImageUrl(): string | undefined {
    return this.imageUrl;
  }

  getCategories(): string[] {
    return [...this.categories];
  }

  // Setters with validation
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Community name cannot be empty");
    }
    this.name = name.trim();
  }

  updateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error("Community description cannot be empty");
    }
    this.description = description.trim();
  }

  updateImageUrl(imageUrl?: string): void {
    this.imageUrl = imageUrl;
  }

  updateCategories(categories: string[]): void {
    this.categories = [...categories];
  }

  incrementMemberCount(): void {
    this.membersCount += 1;
  }

  decrementMemberCount(): void {
    if (this.membersCount > 0) {
      this.membersCount -= 1;
    }
  }

  // Factory method
  static create(
    name: string,
    description: string,
    createdBy: string,
    categories: string[] = [],
    imageUrl?: string
  ): Community {
    return new Community(
      name,
      description,
      true,
      createdBy,
      undefined,
      new Date(),
      1,
      imageUrl,
      categories
    );
  }

  // For serialization
  toObject(): {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: Date;
    membersCount: number;
    imageUrl?: string;
    categories: string[];
    isActive: boolean;
  } {
    return {
      id: this.getId(),
      name: this.name,
      description: this.description,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      membersCount: this.membersCount,
      imageUrl: this.imageUrl,
      categories: this.categories,
      isActive: this.isActive,
    };
  }
}
