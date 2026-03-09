import User from "../models/User.js"
import Attendance from "../models/Attendance.js"
import MemberProfile from "../models/MemberProfile.js"

const getMonthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`

export const adminSummary = async (req, res, next) => {
  try {
    if (!req.user?.gym) {
      return res.status(400).json({ message: "Admin is not assigned to a gym" })
    }

    const [members, trainers, profiles] = await Promise.all([
      User.countDocuments({ role: "member", gym: req.user.gym }),
      User.countDocuments({ role: "trainer", gym: req.user.gym }),
      MemberProfile.find({ membershipPlan: { $ne: null }, gym: req.user.gym }).populate(
        "membershipPlan",
        "price"
      )
    ])

    const revenue = profiles.reduce((total, profile) => {
      const price = profile.membershipPlan?.price
      return typeof price === "number" ? total + price : total
    }, 0)

    const attendanceToday = await Attendance.countDocuments({
      gym: req.user.gym,
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })

    res.json({
      summary: {
        members,
        trainers,
        revenue,
        attendanceToday
      }
    })
  } catch (err) {
    next(err)
  }
}

export const revenueByMonth = async (req, res, next) => {
  try {
    if (!req.user?.gym) {
      return res.status(400).json({ message: "Admin is not assigned to a gym" })
    }

    const now = new Date()
    const monthStarts = Array.from({ length: 6 }, (_, index) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      d.setHours(0, 0, 0, 0)
      return d
    })
    const firstMonth = monthStarts[0]

    const profiles = await MemberProfile.find({
      gym: req.user.gym,
      membershipPlan: { $ne: null },
      $or: [{ startDate: { $gte: firstMonth } }, { createdAt: { $gte: firstMonth } }]
    }).populate("membershipPlan", "price")

    const monthTotals = new Map(monthStarts.map((date) => [getMonthKey(date), 0]))

    profiles.forEach((profile) => {
      const effectiveDate = profile.startDate || profile.createdAt
      if (!effectiveDate) return
      const key = getMonthKey(new Date(effectiveDate))
      if (!monthTotals.has(key)) return
      const price = profile.membershipPlan?.price
      if (typeof price === "number") {
        monthTotals.set(key, monthTotals.get(key) + price)
      }
    })

    const data = monthStarts.map((date) => ({
      month: date.toLocaleString("default", { month: "short" }),
      value: monthTotals.get(getMonthKey(date)) || 0
    }))

    res.json({ revenue: data })
  } catch (err) {
    next(err)
  }
}
