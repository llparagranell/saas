import DietPlan from "../models/DietPlan.js"

export const listDiets = async (req, res, next) => {
  try {
    const { memberId } = req.query
    const filter = {}

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
    const payload = { ...req.validated.body }
    if (req.user?.role === "trainer") {
      payload.trainer = req.user._id
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
      req.user?.role === "trainer" ? { _id: id, trainer: req.user._id } : { _id: id }
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
      req.user?.role === "trainer" ? { _id: id, trainer: req.user._id } : { _id: id }
    const diet = await DietPlan.findOneAndDelete(filter)

    if (!diet) {
      return res.status(404).json({ message: "Diet plan not found" })
    }

    res.json({ message: "Diet plan deleted" })
  } catch (err) {
    next(err)
  }
}
