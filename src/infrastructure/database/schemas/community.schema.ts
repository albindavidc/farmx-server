import mongoose, { Document, Schema } from "mongoose";

export interface CommunityDocument extends Document {
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  membersCount: number;
  imageUrl?: string;
  categories?: string[];
}

const CommunitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  membersCount: { type: Number, default: 1 },
  imageUrl: { type: String },
  categories: [{ type: String }],
});

CommunitySchema.index({ name: 1 }, { unique: true });
CommunitySchema.index({ categories: 1 });
CommunitySchema.index({ createdAt: -1 });

export const CommunityModel = mongoose.model<CommunityDocument>("Community", CommunitySchema);
