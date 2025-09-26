export class Community {
  #name: string;
  #description: string;
  #isActive: boolean;
  #createdBy: string;
  #createdAt: Date;
  #membersCount: number;
  #id?: string;
  #imageUrl?: string;
  #categories?: string[];

  constructor(
    name: string,
    description: string,
    isActive: boolean,
    createdBy: string,
    createdAt: Date = new Date(),
    membersCount: number = 1,
    id?: string,
    imageUrl?: string,
    categories: string[] = []
  ) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#isActive = isActive;
    this.#createdBy = createdBy;
    this.#createdAt = createdAt;
    this.#membersCount = membersCount;
    this.#imageUrl = imageUrl;
    this.#categories = categories;
  }

  // Getters
  get id(): string {
    return this.#id || "";
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  get isActive(): boolean {
    return this.#isActive;
  }

  get createdBy(): string {
    return this.#createdBy;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get membersCount(): number {
    return this.#membersCount;
  }

  get imageUrl(): string | undefined {
    return this.#imageUrl;
  }

  get categories(): string[] | undefined {
    return this.#categories ? [...this.#categories] : undefined;
  }

  set name(name: string) {
    if (!name || name.trim().length === 0) throw new Error("Invalid name");
    this.#name = name.trim();
  }

  set description(description: string) {
    this.#description = description.trim();
  }

  set isActive(isActive: boolean) {
    this.#isActive = isActive;
  }

  set membersCount(membersCount: number) {
    this.#membersCount = membersCount;
  }

  set imageUrl(imageUrl: string) {
    this.#imageUrl = imageUrl;
  }

  set categories(categories: string[]) {
    this.#categories = [...categories];
  }

  decrementMemberCount(): void {
    if (this.membersCount > 0) {
      this.membersCount -= 1;
    }
  }

  incrementMemberCount(): void {
    this.membersCount += 1;
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
      new Date(),
      1,
      undefined,
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
    categories?: string[];
    isActive: boolean;
  } {
    return {
      id: this.id,
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
