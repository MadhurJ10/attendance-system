import mongoose from "mongoose";
import config from "./environment.js"

const {MONGO_URI} = config

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
