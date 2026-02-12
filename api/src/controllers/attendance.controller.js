import Attendance from "../models/Attendance.js"

export const listAttendance = async (req, res, next) => {
  try {
    const { memberId } = req.query
    const filter = memberId ? { member: memberId } : {}
    if (req.user?.role === "member") {
      filter.member = req.user._id
    }
    const records = await Attendance.find(filter)
      .populate("member", "name email")
      .sort({ date: -1 })
    res.json({ records })
  } catch (err) {
    next(err)
  }
}

export const markAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.create(req.validated.body)
    res.status(201).json({ record })
  } catch (err) {
    next(err)
  }
}
