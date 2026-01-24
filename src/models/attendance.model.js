import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "class",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      default: "present",
    },
  },
  { timestamps: true }
);

const attendanceModel = mongoose.model("attendance", attendanceSchema);
export default attendanceModel;
