import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
     role: {
      type: String,
      enum: ["teacher", "student"],
      default: "student",
    }
})

const userModel = mongoose.model("User" , userSchema);

export default userModel;