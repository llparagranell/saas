import mongoose from "mongoose"

const membershipPlanSchema = new mongoose.Schema(
  {
    gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", index: true },
    name: { type: String, required: true, trim: true },
    durationMonths: { type: Number, required: true },
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    description: { type: String }
  },
  { timestamps: true }
)

const MembershipPlan = mongoose.model("MembershipPlan", membershipPlanSchema)
export default MembershipPlan
