export class Community {
  private _id?: string;
  private _name: string;
  private _description: string;
  private _createdBy: string;
  private _createdAt: Date;
  private _membersCount: number;
  private _imageUrl?: string;
  private _categories: string[];

  constructor(
    name: string,
    description: string,
    createdBy: string,
    id?: string,
    createdAt: Date = new Date(),
    membersCount: number = 1,
    imageUrl?: string,
    categories: string[] = []
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._createdBy = createdBy;
    this._createdAt = createdAt;
    this._membersCount = membersCount;
    this._imageUrl = imageUrl;
    this._categories = categories;
  }

  // Getters
  get id(): string {
    if (!this._id) {
      return "";
    }
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get membersCount(): number {
    return this._membersCount;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  get categories(): string[] {
    return [...this._categories];
  }

  // Setters with validation
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Community name cannot be empty");
    }
    this._name = name.trim();
  }

  updateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error("Community description cannot be empty");
    }
    this._description = description.trim();
  }

  updateImageUrl(imageUrl?: string): void {
    this._imageUrl = imageUrl;
  }

  updateCategories(categories: string[]): void {
    this._categories = [...categories];
  }

  incrementMembersCount(): void {
    this._membersCount += 1;
  }

  decrementMembersCount(): void {
    if (this._membersCount > 0) {
      this._membersCount -= 1;
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
      createdBy,
      undefined,
      new Date(),
      1,
      imageUrl,
      categories
    );
  }

  // For serialization
  toObject(): Record<string, string | number | Date | undefined | string[]> {
    if (!this._id) {
      return {};
    }
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      createdBy: this._createdBy,
      createdAt: this._createdAt,
      membersCount: this._membersCount,
      imageUrl: this._imageUrl,
      categories: this._categories,
    };
  }
}
