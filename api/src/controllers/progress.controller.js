import Progress from "../models/Progress.js"
import User from "../models/User.js"

export const listProgress = async (req, res, next) => {
  try {
    const { memberId } = req.query
    const filter = memberId ? { member: memberId } : {}
    if (req.user?.gym) {
      filter.gym = req.user.gym
    }
    if (req.user?.role === "member") {
      filter.member = req.user._id
    }
    const entries = await Progress.find(filter).sort({ date: -1 })
    res.json({ entries })
  } catch (err) {
    next(err)
  }
}

export const createProgress = async (req, res, next) => {
  try {
    if (!req.user?.gym) {
      return res.status(400).json({ message: "User is not assigned to a gym" })
    }

    const member = await User.findOne({
      _id: req.validated.body.member,
      role: "member",
      gym: req.user.gym
    }).select("_id")
    if (!member) {
      return res.status(400).json({ message: "Member not found in this gym" })
    }

    const entry = await Progress.create({
      ...req.validated.body,
      gym: req.user.gym
    })
    res.status(201).json({ entry })
  } catch (err) {
    next(err)
  }
}
