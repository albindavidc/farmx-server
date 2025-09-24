import mongoose, { Schema, Document } from "mongoose";

export interface ICourseProgress {
  courseId: string;
  progress: number;
  completedChapters: string[];
  totalChapters: number;
}

export interface IUserCertificate {
  courseId: string;
  status: "approved" | "unavailable";
  certificateUrl?: string;
  issusedDate?: Date;
  approvedBy?: string;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  _id: string;
  isVerified: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  googleId?: string;

  isFarmer: boolean;
  farmerStatus?: "pending" | "approved" | "rejected";
  farmerRegId: string;
  experience?: number;
  qualification?: string;
  expertise?: string[];
  awards?: string[];
  profilePhoto?: string;
  bio?: string;
  courseProgress?: ICourseProgress[];
  reason?: string;
  courseCertificate?: IUserCertificate[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: "user", enum: ["user", "farmer", "admin"] },
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
    profilePhoto: { type: String },
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

export default mongoose.model<IUserDocument>("User", UserSchema);
