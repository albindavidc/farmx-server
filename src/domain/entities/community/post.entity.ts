import { UserPostRole } from "@domain/enums/user-role.enum.js";

export class Post {
  #text: string;
  #createdAt: Date;
  #userId: string;
  #userName: string;
  #userRole: UserPostRole;
  #communityId: string;
  #communityName: string;
  #id?: string;
  #imageUrl?: string;
  #isEdited?: boolean;
  #lastEditedAt?: Date;

  constructor(
    text: string,
    createdAt: Date,
    userId: string,
    userName: string,
    userRole: UserPostRole,
    communityId: string,
    communityName: string,
    id?: string,
    imageUrl?: string,
    isEdited?: boolean,
    lastEditedAt?: Date
  ) {
    this.#id = id;
    this.#text = text;
    this.#createdAt = createdAt;
    this.#userId = userId;
    this.#userName = userName;
    this.#userRole = userRole;
    this.#communityId = communityId;
    this.#communityName = communityName;
    this.#imageUrl = imageUrl;
    this.#isEdited = isEdited;
    this.#lastEditedAt = lastEditedAt;
  }

  get id(): string {
    return this.#id || "";
  }

  get text(): string {
    return this.#text;
  }

  set text(text: string) {
    this.#text = text;

    this.#isEdited = true;
    this.#lastEditedAt = new Date();
  }
  set imageUrl(imageUrl: string | undefined) {
    if(imageUrl){
      this.#isEdited = true;
      this.#lastEditedAt = new Date();
      this.#imageUrl = imageUrl;
    }
  }

  get imageUrl(): string | undefined {
    return this.#imageUrl;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get userId(): string {
    return this.#userId;
  }

  get userName(): string {
    return this.#userName;
  }

  get userRole(): UserPostRole {
    return this.#userRole;
  }

  get communityId(): string {
    return this.#communityId;
  }

  get communityName(): string {
    return this.#communityName;
  }

  get isEdited(): boolean | undefined {
    return this.#isEdited;
  }

  get lastEditedAt(): Date | undefined {
    return this.#lastEditedAt;
  }
}
