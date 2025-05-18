import { UserPostRole } from "../../enums/user-role.enum";

export class Post {
  constructor(
    public _id: string,
    public text: string,
    public createdAt: Date,
    public userId: string,
    public userName: string,
    public userRole: UserPostRole,
    public communityId: string,
    public communityName: string,
    public imageUrl?: string,
    public isEdited?: boolean,
    public lastEditedAt?: Date,
  ) {}

  public update(text: string, imageUrl?: string): void {
    this.text = text;
    if (imageUrl !== undefined) {
      this.imageUrl = imageUrl;
    }
    this.isEdited = true;
    this.lastEditedAt = new Date();
  }
}
