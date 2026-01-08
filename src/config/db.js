import mongoose from "mongoose";
import config from "./environment.js"

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/auth_db");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
