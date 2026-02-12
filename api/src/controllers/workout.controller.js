import WorkoutPlan from "../models/WorkoutPlan.js"

export const listWorkouts = async (req, res, next) => {
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

    const workouts = await WorkoutPlan.find(filter).sort({ createdAt: -1 })
    res.json({ workouts })
  } catch (err) {
    next(err)
  }
}

export const createWorkout = async (req, res, next) => {
  try {
    const payload = { ...req.validated.body }
    if (req.user?.role === "trainer") {
      payload.trainer = req.user._id
    }

    const workout = await WorkoutPlan.create(payload)
    res.status(201).json({ workout })
  } catch (err) {
    next(err)
  }
}

export const updateWorkout = async (req, res, next) => {
  try {
    const { id } = req.params
    const filter =
      req.user?.role === "trainer" ? { _id: id, trainer: req.user._id } : { _id: id }
    const workout = await WorkoutPlan.findOneAndUpdate(filter, req.validated.body, { new: true })

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" })
    }
    res.json({ workout })
  } catch (err) {
    next(err)
  }
}

export const deleteWorkout = async (req, res, next) => {
  try {
    const { id } = req.params
    const filter =
      req.user?.role === "trainer" ? { _id: id, trainer: req.user._id } : { _id: id }
    const workout = await WorkoutPlan.findOneAndDelete(filter)

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" })
    }

    res.json({ message: "Workout deleted" })
  } catch (err) {
    next(err)
  }
}
