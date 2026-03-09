import Gym from "../models/Gym.js"
import User from "../models/User.js"

export const listGyms = async (req, res, next) => {
  try {
    const gyms = await Gym.find({}).sort({ createdAt: -1 })
    const admins = await User.find({ role: "admin" })
      .select("name email gym status")
      .sort({ createdAt: -1 })

    const adminsByGym = admins.reduce((acc, admin) => {
      const gymId = admin.gym ? admin.gym.toString() : ""
      if (!gymId) return acc
      if (!acc.has(gymId)) acc.set(gymId, [])
      acc.get(gymId).push({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        status: admin.status
      })
      return acc
    }, new Map())

    const rows = gyms.map((gym) => ({
      id: gym._id,
      name: gym.name,
      code: gym.code || "",
      isActive: gym.isActive,
      admins: adminsByGym.get(gym._id.toString()) || []
    }))

    // Backward compatibility: older admin records may not be linked to a gym yet.
    const unassignedRows = admins
      .filter((admin) => !admin.gym)
      .map((admin) => ({
        id: `legacy-${admin._id}`,
        name: "Unassigned Legacy Gym",
        code: "",
        isActive: true,
        admins: [
          {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            status: admin.status
          }
        ]
      }))

    res.json({ gyms: [...rows, ...unassignedRows] })
  } catch (err) {
    next(err)
  }
}

export const createGymWithAdmin = async (req, res, next) => {
  try {
    const { gymName, gymCode, admin } = req.validated.body
    const existingGym = await Gym.findOne({ name: gymName })
    if (existingGym) {
      return res.status(409).json({ message: "Gym name already exists" })
    }

    const existingAdmin = await User.findOne({ email: admin.email })
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin email already in use" })
    }

    const gym = await Gym.create({
      name: gymName,
      code: gymCode || undefined,
      createdBy: req.user._id
    })

    const passwordHash = User.hashPassword(admin.password)
    const adminUser = await User.create({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: "admin",
      gym: gym._id,
      passwordHash
    })

    res.status(201).json({
      gym: {
        id: gym._id,
        name: gym.name,
        code: gym.code || "",
        isActive: gym.isActive
      },
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        gym: adminUser.gym
      }
    })
  } catch (err) {
    next(err)
  }
}
