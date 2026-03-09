import WorkoutPlan from "../models/WorkoutPlan.js"
import User from "../models/User.js"

export const listWorkouts = async (req, res, next) => {
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

    const workouts = await WorkoutPlan.find(filter).sort({ createdAt: -1 })
    res.json({ workouts })
  } catch (err) {
    next(err)
  }
}

export const createWorkout = async (req, res, next) => {
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
      req.user?.role === "trainer"
        ? { _id: id, trainer: req.user._id, gym: req.user.gym }
        : { _id: id, gym: req.user.gym }
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
      req.user?.role === "trainer"
        ? { _id: id, trainer: req.user._id, gym: req.user.gym }
        : { _id: id, gym: req.user.gym }
    const workout = await WorkoutPlan.findOneAndDelete(filter)

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" })
    }

    res.json({ message: "Workout deleted" })
  } catch (err) {
    next(err)
  }
}
