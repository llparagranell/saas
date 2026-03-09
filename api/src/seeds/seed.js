import dotenv from "dotenv"
import mongoose from "mongoose"
import User from "../models/User.js"
import MemberProfile from "../models/MemberProfile.js"
import TrainerProfile from "../models/TrainerProfile.js"
import MembershipPlan from "../models/MembershipPlan.js"
import Attendance from "../models/Attendance.js"
import Payment from "../models/Payment.js"
import WorkoutPlan from "../models/WorkoutPlan.js"
import DietPlan from "../models/DietPlan.js"
import Progress from "../models/Progress.js"
import Gym from "../models/Gym.js"

dotenv.config()

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  await Promise.all([
    User.deleteMany({}),
    Gym.deleteMany({}),
    MemberProfile.deleteMany({}),
    TrainerProfile.deleteMany({}),
    MembershipPlan.deleteMany({}),
    Attendance.deleteMany({}),
    Payment.deleteMany({}),
    WorkoutPlan.deleteMany({}),
    DietPlan.deleteMany({}),
    Progress.deleteMany({})
  ])

  const superAdmin = await User.create({
    name: "Platform Owner",
    email: "owner@gym.local",
    phone: "9990000000",
    role: "super_admin",
    passwordHash: User.hashPassword("Owner@123")
  })

  const gym = await Gym.create({
    name: "Atlas Gym - Downtown",
    code: "ATLAS-DT",
    createdBy: superAdmin._id
  })

  const admin = await User.create({
    name: "Admin One",
    email: "admin@gym.local",
    phone: "9990001111",
    role: "admin",
    gym: gym._id,
    passwordHash: User.hashPassword("Admin@123")
  })
  const trainer = await User.create({
    name: "Trainer Mia",
    email: "trainer@gym.local",
    phone: "9990002222",
    role: "trainer",
    gym: gym._id,
    passwordHash: User.hashPassword("Trainer@123")
  })
  const member = await User.create({
    name: "Member Alex",
    email: "member@gym.local",
    phone: "9990003333",
    role: "member",
    gym: gym._id,
    passwordHash: User.hashPassword("Member@123")
  })

  await TrainerProfile.create({
    user: trainer._id,
    gym: gym._id,
    specialties: ["Strength", "Mobility"],
    experienceYears: 5
  })

  const plan = await MembershipPlan.create({
    gym: gym._id,
    name: "Gold Monthly",
    durationMonths: 1,
    price: 49,
    description: "Unlimited access + free assessment"
  })

  await MemberProfile.create({
    user: member._id,
    gym: gym._id,
    trainer: trainer._id,
    membershipPlan: plan._id,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    heightCm: 175,
    weightKg: 78,
    goals: "Fat loss and strength"
  })

  await Attendance.create({
    gym: gym._id,
    member: member._id,
    method: "manual"
  })
  await Payment.create({
    gym: gym._id,
    member: member._id,
    amount: 49,
    method: "cash",
    status: "paid"
  })
  await WorkoutPlan.create({
    gym: gym._id,
    member: member._id,
    trainer: trainer._id,
    title: "Starter Strength",
    schedule: [
      { day: "Mon", focus: "Upper", exercises: [{ name: "Bench Press", sets: 4, reps: 8 }] },
      { day: "Wed", focus: "Lower", exercises: [{ name: "Squat", sets: 4, reps: 6 }] }
    ]
  })
  await DietPlan.create({
    gym: gym._id,
    member: member._id,
    trainer: trainer._id,
    title: "Lean Plan",
    meals: [
      { name: "Breakfast", time: "08:00", items: ["Oats", "Eggs"] },
      { name: "Lunch", time: "13:00", items: ["Chicken", "Rice", "Salad"] }
    ]
  })
  await Progress.create({
    gym: gym._id,
    member: member._id,
    weightKg: 78,
    bodyFatPercent: 18,
    notes: "Baseline check"
  })

  console.log("Seed complete")
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
