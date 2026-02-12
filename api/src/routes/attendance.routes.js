import { Router } from "express"
import { z } from "zod"
import {
  listAttendance,
  markAttendance
} from "../controllers/attendance.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const attendanceSchema = z.object({
  body: z.object({
    member: z.string().min(1),
    date: z.coerce.date().optional(),
    status: z.enum(["present", "absent"]).optional(),
    method: z.enum(["manual", "qr"]).optional()
  })
})

router.get("/", requireAuth, listAttendance)
router.post(
  "/",
  requireAuth,
  requireRole("admin", "trainer"),
  validate(attendanceSchema),
  markAttendance
)

export default router
