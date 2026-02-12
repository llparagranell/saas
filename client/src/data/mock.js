export const stats = [
  { label: "Active Members", value: "248", trend: "+12 this month" },
  { label: "Active Trainers", value: "12", trend: "+1 this month" },
  { label: "Monthly Revenue", value: "$12.4k", trend: "+8.2%" },
  { label: "Attendance Today", value: "89", trend: "Peak 7-9 AM" }
]

export const revenue = [
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 9200 },
  { month: "Mar", value: 8800 },
  { month: "Apr", value: 10100 },
  { month: "May", value: 11000 },
  { month: "Jun", value: 12400 }
]

export const members = [
  {
    id: 1,
    name: "Alex Rivera",
    plan: "Gold Monthly",
    trainer: "Mia Carter",
    status: "Active",
    expires: "2026-03-01"
  },
  {
    id: 2,
    name: "Priya Singh",
    plan: "Platinum Quarterly",
    trainer: "Ryan Lee",
    status: "Active",
    expires: "2026-04-18"
  },
  {
    id: 3,
    name: "Noah Park",
    plan: "Starter",
    trainer: "Mia Carter",
    status: "Expiring",
    expires: "2026-02-18"
  }
]

export const trainers = [
  { id: 1, name: "Mia Carter", specialty: "Strength", members: 18 },
  { id: 2, name: "Ryan Lee", specialty: "Mobility", members: 14 },
  { id: 3, name: "Sara Khan", specialty: "HIIT", members: 12 }
]

export const attendance = [
  { id: 1, name: "Alex Rivera", time: "08:10", method: "Manual" },
  { id: 2, name: "Priya Singh", time: "08:32", method: "QR" },
  { id: 3, name: "Noah Park", time: "09:05", method: "Manual" }
]

export const payments = [
  { id: 1, member: "Alex Rivera", amount: "$49", method: "Cash", status: "Paid" },
  { id: 2, member: "Priya Singh", amount: "$120", method: "Card", status: "Paid" },
  { id: 3, member: "Noah Park", amount:  "$29", method: "UPI", status: "Pending" }
]

export const workouts = [
  {
    id: 1,
    title: "Starter Strength",
    focus: "Upper / Lower Split",
    status: "Active"
  },
  {
    id: 2,
    title: "Mobility Reset",
    focus: "Recovery",
    status: "Draft"
  }
]

export const progressEntries = [
  { id: 1, date: "2026-01-12", weight: "78 kg", bodyFat: "18%" },
  { id: 2, date: "2026-02-02", weight: "76.5 kg", bodyFat: "17%" }
]
