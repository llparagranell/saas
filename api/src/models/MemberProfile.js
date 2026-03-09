import mongoose from "mongoose"

const memberProfileSchema = new mongoose.Schema(
  {
    gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan"
    },
    startDate: { type: Date },
    endDate: { type: Date },
    heightCm: { type: Number },
    weightKg: { type: Number },
    goals: { type: String }
  },
  { timestamps: true }
)

const MemberProfile = mongoose.model("MemberProfile", memberProfileSchema)
export default MemberProfile
