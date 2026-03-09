import Payment from "../models/Payment.js"
import User from "../models/User.js"

export const listPayments = async (req, res, next) => {
  try {
    const { memberId } = req.query
    const filter = memberId ? { member: memberId } : {}

    if (req.user?.gym) {
      filter.gym = req.user.gym
    }

    if (req.user?.role === "member") {
      filter.member = req.user._id
    }
    const payments = await Payment.find(filter)
      .populate("member", "name email")
      .sort({ paidAt: -1 })
    res.json({ payments })
  } catch (err) {
    next(err)
  }
}

export const createPayment = async (req, res, next) => {
  try {
    if (!req.user?.gym) {
      return res.status(400).json({ message: "Admin is not assigned to a gym" })
    }

    const member = await User.findOne({
      _id: req.validated.body.member,
      role: "member",
      gym: req.user.gym
    }).select("_id")
    if (!member) {
      return res.status(400).json({ message: "Member not found in this gym" })
    }

    const payment = await Payment.create({
      ...req.validated.body,
      gym: req.user.gym
    })
    res.status(201).json({ payment })
  } catch (err) {
    next(err)
  }
}

export const razorpayPlaceholder = async (req, res) => {
  res.json({
    message:
      "Razorpay integration placeholder. Configure keys and create orders here."
  })
}
