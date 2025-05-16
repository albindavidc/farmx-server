import mongoose, { Schema } from "mongoose";
import { UserPostRole } from "../../../domain/enums/user-role.enum";

export interface PostDocument extends Document {
  text: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userRole: UserPostRole;
  communityId: string;
  communityName: string;
  imageUrl?: string;
  isEdited?: boolean;
  lastEditedAt?: Date;
  _id?: string;
}

const PostSchema = new Schema<PostDocument>(
  {
    text: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: {
      type: String,
      enum: Object.values(UserPostRole),
      required: true,
    },
    communityId: { type: String, required: true },
    communityName: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
    lastEditedAt: { type: Date },
  },
  {
    versionKey: false,
  }
);

// Indexes for performance
PostSchema.index({ communityId: 1, createdAt: -1 });
PostSchema.index({ userId: 1 });

export const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
