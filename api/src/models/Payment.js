import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", index: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["cash", "card", "upi", "online", "razorpay"],
      default: "cash"
    },
    status: { type: String, enum: ["paid", "pending"], default: "paid" },
    paidAt: { type: Date, default: Date.now },
    reference: { type: String }
  },
  { timestamps: true }
)

const Payment = mongoose.model("Payment", paymentSchema)
export default Payment
