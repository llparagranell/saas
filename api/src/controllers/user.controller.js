import User from "../models/User.js"
import MemberProfile from "../models/MemberProfile.js"
import TrainerProfile from "../models/TrainerProfile.js"
import MembershipPlan from "../models/MembershipPlan.js"
import Payment from "../models/Payment.js"

export const listUsers = async (req, res, next) => {
  try {
    const { role } = req.query
    const filter = role ? { role } : {}
    if (req.user?.gym) {
      filter.gym = req.user.gym
    }
    const users = await User.find(filter).select("-passwordHash").sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) {
    next(err)
  }
}

export const getMyMemberProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "member") {
      return res.status(403).json({ message: "Only members have profiles" })
    }

    const profile = await MemberProfile.findOne({ user: req.user._id, gym: req.user.gym })
      .populate("trainer", "name email")
      .populate("membershipPlan", "name durationMonths price")

    if (!profile) {
      return res.json({ profile: null })
    }

    res.json({
      profile: {
        id: profile._id,
        membershipPlan: profile.membershipPlan
          ? {
              id: profile.membershipPlan._id,
              name: profile.membershipPlan.name,
              durationMonths: profile.membershipPlan.durationMonths,
              price: profile.membershipPlan.price
            }
          : null,
        trainer: profile.trainer
          ? {
              id: profile.trainer._id,
              name: profile.trainer.name,
              email: profile.trainer.email
            }
          : null,
        startDate: profile.startDate,
        endDate: profile.endDate
      }
    })
  } catch (err) {
    next(err)
  }
}

export const listMembersWithProfile = async (req, res, next) => {
  try {
    if (!req.user?.gym) {
      return res.status(400).json({ message: "Admin is not assigned to a gym" })
    }

    const profiles = await MemberProfile.find({ gym: req.user.gym })
      .populate("user")
      .populate("trainer")
      .populate("membershipPlan")
      .sort({ createdAt: -1 })

    const members = profiles
      .filter((profile) => !!profile.user)
      .map((profile) => {
        const user = profile.user
        const trainer = profile.trainer
        const plan = profile.membershipPlan

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status,
          plan: plan ? plan.name : "No plan",
          trainer: trainer ? trainer.name : "Unassigned",
          expires: profile.endDate || null
        }
      })

    res.json({ members })
  } catch (err) {
    next(err)
  }
}

export const listTrainersWithProfile = async (req, res, next) => {
  try {
    if (!req.user?.gym) {
      return res.status(400).json({ message: "Admin is not assigned to a gym" })
    }

    const profiles = await TrainerProfile.find({ gym: req.user.gym })
      .populate("user")
      .sort({ createdAt: -1 })

    const trainers = await Promise.all(
      profiles
        .filter((profile) => !!profile.user)
        .map(async (profile) => {
          const user = profile.user
          const memberCount = await MemberProfile.countDocuments({ trainer: user._id, gym: req.user.gym })

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            specialties: profile.specialties || [],
            experienceYears: profile.experienceYears ?? 0,
            bio: profile.bio || "",
            members: memberCount
          }
        })
    )

    res.json({ trainers })
  } catch (err) {
    next(err)
  }
}

export const listMyMembers = async (req, res, next) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({ message: "Only trainers can view assigned members" })
    }

    const profiles = await MemberProfile.find({ trainer: req.user._id, gym: req.user.gym })
      .populate("user")
      .populate("membershipPlan")
      .sort({ createdAt: -1 })

    const members = profiles
      .filter((profile) => !!profile.user)
      .map((profile) => {
        const user = profile.user
        const plan = profile.membershipPlan

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          goal: profile.goals || "",
          status: user.status === "active" ? "On track" : "Inactive",
          plan: plan ? plan.name : "No plan"
        }
      })

    res.json({ members })
  } catch (err) {
    next(err)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, profile } = req.validated.body
    if (!req.user?.gym) {
      return res.status(400).json({ message: "Admin is not assigned to a gym" })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: "Email already in use" })
    }

    const safeProfile = profile ?? {}
    if (role === "member") {
      if (safeProfile.membershipPlan) {
        const plan = await MembershipPlan.findOne({
          _id: safeProfile.membershipPlan,
          gym: req.user.gym
        }).select("_id")
        if (!plan) {
          return res.status(400).json({ message: "Invalid membership plan for this gym" })
        }
      }

      if (safeProfile.trainer) {
        const trainer = await User.findOne({
          _id: safeProfile.trainer,
          role: "trainer",
          gym: req.user.gym
        }).select("_id")
        if (!trainer) {
          return res.status(400).json({ message: "Invalid trainer for this gym" })
        }
      }
    }

    const passwordHash = User.hashPassword(password)
    const user = await User.create({
      name,
      email,
      phone,
      role,
      gym: req.user.gym,
      passwordHash
    })
    if (role === "member") {
      const memberProfile = await MemberProfile.create({
        user: user._id,
        gym: req.user.gym,
        ...safeProfile
      })

      // Auto-record initial membership payment so admin revenue reflects new member plan cost.
      if (memberProfile.membershipPlan) {
        const plan = await MembershipPlan.findOne({
          _id: memberProfile.membershipPlan,
          gym: req.user.gym
        }).select("price")
        if (plan && typeof plan.price === "number" && plan.price > 0) {
          await Payment.create({
            gym: req.user.gym,
            member: user._id,
            amount: plan.price,
            status: "paid",
            reference: `auto-membership-${memberProfile._id}`
          })
        }
      }
    }
    if (role === "trainer") {
      await TrainerProfile.create({ user: user._id, gym: req.user.gym, ...safeProfile })
    }
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, gym: user.gym }
    })
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, phone, status } = req.validated.body
    const user = await User.findOneAndUpdate(
      { _id: id, gym: req.user.gym, role: { $in: ["trainer", "member"] } },
      { name, phone, status },
      { new: true }
    ).select("-passwordHash")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ user })
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findOneAndDelete({
      _id: id,
      gym: req.user.gym,
      role: { $in: ["trainer", "member"] }
    })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    await MemberProfile.deleteMany({ user: id, gym: req.user.gym })
    await TrainerProfile.deleteMany({ user: id, gym: req.user.gym })
    res.json({ message: "User deleted" })
  } catch (err) {
    next(err)
  }
}

export const assignTrainer = async (req, res, next) => {
  try {
    const { memberId } = req.params
    const { trainerId } = req.validated.body

    const trainer = await User.findOne({
      _id: trainerId,
      role: "trainer",
      gym: req.user.gym
    }).select("_id")
    if (!trainer) {
      return res.status(400).json({ message: "Trainer not found in this gym" })
    }

    const profile = await MemberProfile.findOneAndUpdate(
      { user: memberId, gym: req.user.gym },
      { trainer: trainerId },
      { new: true }
    )
    if (!profile) {
      return res.status(404).json({ message: "Member profile not found" })
    }
    res.json({ profile })
  } catch (err) {
    next(err)
  }
}
