import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import { errorHandler, notFound } from "./middleware/error.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import membershipRoutes from "./routes/membership.routes.js"
import attendanceRoutes from "./routes/attendance.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import workoutRoutes from "./routes/workout.routes.js"
import dietRoutes from "./routes/diet.routes.js"
import progressRoutes from "./routes/progress.routes.js"
import reportRoutes from "./routes/report.routes.js"

const app = express()

app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "gym-management-api" })
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/memberships", membershipRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/workouts", workoutRoutes)
app.use("/api/diets", dietRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/reports", reportRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
