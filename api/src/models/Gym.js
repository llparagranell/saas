import mongoose from "mongoose"

const gymSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: { type: String, trim: true, uppercase: true, unique: true, sparse: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

const Gym = mongoose.model("Gym", gymSchema)
export default Gym
