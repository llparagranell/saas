import mongoose from "mongoose"

const trainerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialties: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    bio: { type: String }
  },
  { timestamps: true }
)

const TrainerProfile = mongoose.model("TrainerProfile", trainerProfileSchema)
export default TrainerProfile
