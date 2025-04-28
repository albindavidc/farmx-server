import { UserRole } from "../../enums/user-role.enum";

export class Post {
  constructor(
    public id: string,
    public text: string,
    public imageUrl: string,
    public createdAt: Date,
    public userId: string,
    public userName: string,
    public userRole: UserRole,
    public communityId: string,
    public communityName: string,
    public isEditing?: boolean,
    public lastEditedAt?: Date
  ) {}
}
