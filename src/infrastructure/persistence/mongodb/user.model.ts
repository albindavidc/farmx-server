import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the User Document
export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  roles: string[];
  isVerified: boolean;
  firebaseUid?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose Schema
const UserSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    firebaseUid: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>(
  "User",
  UserSchema
);
