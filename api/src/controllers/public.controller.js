import MembershipPlan from "../models/MembershipPlan.js"
import Gym from "../models/Gym.js"
import User from "../models/User.js"

export const getHome = async (req, res, next) => {
  try {
    const [gyms, members, trainers] = await Promise.all([
      Gym.countDocuments({}),
      User.countDocuments({ role: "member", status: "active" }),
      User.countDocuments({ role: "trainer", status: "active" })
    ])

    const plans = await MembershipPlan.find({ isActive: true })
      .sort({ price: 1, createdAt: 1 })
      .limit(3)
      .select("_id name durationMonths price description")
      .lean()

    res.json({
      stats: { gyms, members, trainers },
      plans
    })
  } catch (err) {
    next(err)
  }
}

