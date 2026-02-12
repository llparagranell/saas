import mongoose from "mongoose"

const workoutPlanSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    notes: { type: String },
    schedule: [
      {
        day: { type: String },
        focus: { type: String },
        exercises: [{ name: String, sets: Number, reps: Number }]
      }
    ]
  },
  { timestamps: true }
)

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema)
export default WorkoutPlan
