import dotenv from "dotenv";
dotenv.config();

export default {
  MONGO_URI: process.env.MONGO_URI,
  REDIS_PORT: process.env.REDIS_PORT,
};
