import mongoose from "mongoose"

const dietPlanSchema = new mongoose.Schema(
  {
    gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", index: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    notes: { type: String },
    meals: [
      {
        name: { type: String },
        time: { type: String },
        items: [{ type: String }]
      }
    ]
  },
  { timestamps: true }
)

const DietPlan = mongoose.model("DietPlan", dietPlanSchema)
export default DietPlan
