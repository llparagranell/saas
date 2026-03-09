import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema(
  {
    gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", index: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["present", "absent"], default: "present" },
    method: { type: String, enum: ["manual", "qr"], default: "manual" }
  },
  { timestamps: true }
)

const Attendance = mongoose.model("Attendance", attendanceSchema)
export default Attendance
