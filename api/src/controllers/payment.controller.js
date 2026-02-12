import Payment from "../models/Payment.js"

export const listPayments = async (req, res, next) => {
  try {
    const { memberId } = req.query
    const filter = memberId ? { member: memberId } : {}
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
    const payment = await Payment.create(req.validated.body)
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
