import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/url-shortner";

export default async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
}