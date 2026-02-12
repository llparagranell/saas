import jwt from "jsonwebtoken"
import User from "../models/User.js"

const signToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

export const registerMember = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.validated.body
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: "Email already in use" })
    }
    const passwordHash = User.hashPassword(password)
    const user = await User.create({
      name,
      email,
      phone,
      role: "member",
      passwordHash
    })
    const token = signToken(user)
    res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body
    const user = await User.findOne({ email })
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
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    next(err)
  }
}

export const me = async (req, res) => {
  res.json({ user: req.user })
}
