import MembershipPlan from "../models/MembershipPlan.js"

export const listPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find().sort({ createdAt: -1 })
    res.json({ plans })
  } catch (err) {
    next(err)
  }
}

export const createPlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.create(req.validated.body)
    res.status(201).json({ plan })
  } catch (err) {
    next(err)
  }
}

export const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params
    const plan = await MembershipPlan.findByIdAndUpdate(id, req.validated.body, {
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
    const plan = await MembershipPlan.findByIdAndDelete(id)
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" })
    }
    res.json({ message: "Plan deleted" })
  } catch (err) {
    next(err)
  }
}
