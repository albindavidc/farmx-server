import mongoose, { Document, Schema } from "mongoose";

export interface CommunityMembersDocument extends Document {
  communityId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  joinedAt: Date;
  role: string;
  status: string;
}

const CommunityMemberSchema: Schema = new Schema({
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "member",
    enum: ["member", "moderator", "admin"],
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "banned", "pending"],
  },
});

CommunityMemberSchema.index({ communityId: 1, userId: 1 }, { unique: true });

export const CommunityMemberModel = mongoose.model<CommunityMembersDocument>(
  "CommunityMember",
  CommunityMemberSchema
);
