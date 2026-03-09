import MembershipPlan from "../models/MembershipPlan.js"

export const listPlans = async (req, res, next) => {
  try {
    const filter = {}
    if (req.user?.role === "super_admin" && req.query.gymId) {
      filter.gym = req.query.gymId
    } else if (req.user?.gym) {
      filter.gym = req.user.gym
    }

    const plans = await MembershipPlan.find(filter).sort({ createdAt: -1 })
    res.json({ plans })
  } catch (err) {
    next(err)
  }
}

export const createPlan = async (req, res, next) => {
  try {
    if (!req.user?.gym) {
      return res.status(400).json({ message: "Admin is not assigned to a gym" })
    }
    const plan = await MembershipPlan.create({
      ...req.validated.body,
      gym: req.user.gym
    })
    res.status(201).json({ plan })
  } catch (err) {
    next(err)
  }
}

export const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params
    const filter = { _id: id }
    if (req.user?.gym) {
      filter.gym = req.user.gym
    }
    const plan = await MembershipPlan.findOneAndUpdate(filter, req.validated.body, {
      new: true
    })
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" })
    }
    res.json({ plan })
  } catch (err) {
    next(err)
  }
}

export const deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params
    const filter = { _id: id }
    if (req.user?.gym) {
      filter.gym = req.user.gym
    }
    const plan = await MembershipPlan.findOneAndDelete(filter)
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" })
    }
    res.json({ message: "Plan deleted" })
  } catch (err) {
    next(err)
  }
}
