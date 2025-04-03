import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: process.env.MONGO_DB!,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to the MongoDB:", error);
    process.exit(1);
  }
};
