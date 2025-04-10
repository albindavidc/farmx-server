import mongoose, { Schema, Document } from "mongoose";

export interface CourseProgress {
  courseId: string;
  progress: number;
  completedChapters: string[];
  totalChapters: number;
}

export interface UserCertificate {
  courseId: string;
  status: "approved" | "unavailable";
  certificateUrl?: string;
  issusedDate?: Date;
  approvedBy?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role?: "user" | "farmer" | "admin";
  phone: string;
  _id: string;
  isVerified: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  googleId?: string;

  isFarmer: boolean;
  farmerRegId: string;
  experience?: number;
  qualification?: string;
  expertise?: string[];
  awards?: string[];
  farmerStatus?: "pending" | "approved" | "rejected";
  profile?: string;
  bio?: string;
  courseProgress?: CourseProgress[];
  reason?: string;
  courseCertificate?: UserCertificate[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: "User", enum: ["user", "farmer", "admin"] },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    googleId: { type: String },

    isFarmer: { type: Boolean, default: false },
    farmerRegId: { type: String },
    experience: { type: Number },
    qualification: { type: String },
    expertise: { type: [String] },
    awards: { type: [String] },
    farmerStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    profile: { type: String },
    bio: { type: String },
    courseProgress: {
      type: [
        {
          courseId: String,
          progress: Number,
          completedChapters: [String],
          totalChapters: Number,
        },
      ],
      default: [],
    },
    reason: { type: String },
    courseCertificate: {
      type: [
        {
          courseId: String,
          status: String,
          certificateUrl: String,
          issuedDate: Date,
          approvedBy: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDocument>("User", UserSchema);
