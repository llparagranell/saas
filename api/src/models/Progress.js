import mongoose from "mongoose"

const progressSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    weightKg: { type: Number },
    bodyFatPercent: { type: Number },
    notes: { type: String }
  },
  { timestamps: true }
)

const Progress = mongoose.model("Progress", progressSchema)
export default Progress
