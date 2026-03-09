import DietPlan from "../models/DietPlan.js"
import User from "../models/User.js"

export const listDiets = async (req, res, next) => {
  try {
    const { memberId } = req.query
    const filter = {}

    if (req.user?.gym) {
      filter.gym = req.user.gym
    }

    if (memberId) {
      filter.member = memberId
    }

    if (req.user?.role === "member") {
      filter.member = req.user._id
    }

    if (req.user?.role === "trainer") {
      filter.trainer = req.user._id
    }

    const diets = await DietPlan.find(filter).sort({ createdAt: -1 })
    res.json({ diets })
  } catch (err) {
    next(err)
  }
}

export const createDiet = async (req, res, next) => {
  try {
    if (!req.user?.gym) {
      return res.status(400).json({ message: "User is not assigned to a gym" })
    }

    const payload = { ...req.validated.body }
    const member = await User.findOne({
      _id: payload.member,
      role: "member",
      gym: req.user.gym
    }).select("_id")
    if (!member) {
      return res.status(400).json({ message: "Member not found in this gym" })
    }

    payload.gym = req.user.gym
    if (req.user?.role === "trainer") {
      payload.trainer = req.user._id
    } else if (payload.trainer) {
      const trainer = await User.findOne({
        _id: payload.trainer,
        role: "trainer",
        gym: req.user.gym
      }).select("_id")
      if (!trainer) {
        return res.status(400).json({ message: "Trainer not found in this gym" })
      }
    }

    const diet = await DietPlan.create(payload)
    res.status(201).json({ diet })
  } catch (err) {
    next(err)
  }
}

export const updateDiet = async (req, res, next) => {
  try {
    const { id } = req.params
    const filter =
      req.user?.role === "trainer"
        ? { _id: id, trainer: req.user._id, gym: req.user.gym }
        : { _id: id, gym: req.user.gym }
    const diet = await DietPlan.findOneAndUpdate(filter, req.validated.body, { new: true })

    if (!diet) {
      return res.status(404).json({ message: "Diet plan not found" })
    }
    res.json({ diet })
  } catch (err) {
    next(err)
  }
}

export const deleteDiet = async (req, res, next) => {
  try {
    const { id } = req.params
    const filter =
      req.user?.role === "trainer"
        ? { _id: id, trainer: req.user._id, gym: req.user.gym }
        : { _id: id, gym: req.user.gym }
    const diet = await DietPlan.findOneAndDelete(filter)

    if (!diet) {
      return res.status(404).json({ message: "Diet plan not found" })
    }

    res.json({ message: "Diet plan deleted" })
  } catch (err) {
    next(err)
  }
}
