import jwt from "jsonwebtoken"
import User from "../models/User.js"
import Gym from "../models/Gym.js"

const signToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, gym: user.gym ? user.gym.toString() : null },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

export const registerMember = async (req, res, next) => {
  try {
    const { name, email, password, phone, gymId } = req.validated.body
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: "Email already in use" })
    }
    const gym = gymId ? await Gym.findById(gymId).select("_id") : null
    if (!gym) {
      return res.status(400).json({
        message: "Member self-registration requires a valid gym. Ask your admin to create your account."
      })
    }
    const passwordHash = User.hashPassword(password)
    const user = await User.create({
      name,
      email,
      phone,
      gym: gym._id,
      role: "member",
      passwordHash
    })
    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, name, email, role: user.role, gym: user.gym }
    })
  } catch (err) {
    next(err)
  }
}

export const registerSuperAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, setupKey } = req.validated.body
    const existingSuperAdmin = await User.exists({ role: "super_admin" })
    if (existingSuperAdmin) {
      return res.status(409).json({ message: "Super admin already exists" })
    }
    if (process.env.SUPER_ADMIN_SETUP_KEY && setupKey !== process.env.SUPER_ADMIN_SETUP_KEY) {
      return res.status(401).json({ message: "Invalid setup key" })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: "Email already in use" })
    }

    const passwordHash = User.hashPassword(password)
    const user = await User.create({
      name,
      email,
      phone,
      role: "super_admin",
      passwordHash
    })

    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, name, email, role: user.role, gym: null }
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body
    const user = await User.findOne({ email }).populate("gym", "name")
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
    const ok = await user.comparePassword(password)
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
    const token = signToken(user)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gym: user.gym?._id ?? user.gym ?? null,
        gymName: user.gym?.name ?? null
      }
    })
  } catch (err) {
    next(err)
  }
}

export const me = async (req, res) => {
  res.json({ user: req.user })
}
