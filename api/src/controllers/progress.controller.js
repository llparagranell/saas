import Progress from "../models/Progress.js"

export const listProgress = async (req, res, next) => {
  try {
    const { memberId } = req.query
    const filter = memberId ? { member: memberId } : {}
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
    const entry = await Progress.create(req.validated.body)
    res.status(201).json({ entry })
  } catch (err) {
    next(err)
  }
}
