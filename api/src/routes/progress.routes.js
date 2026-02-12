import { Router } from "express"
import { z } from "zod"
import { createProgress, listProgress } from "../controllers/progress.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const progressSchema = z.object({
  body: z.object({
    member: z.string().min(1),
    date: z.coerce.date().optional(),
    weightKg: z.number().optional(),
    bodyFatPercent: z.number().optional(),
    notes: z.string().optional()
  })
})

router.get("/", requireAuth, listProgress)
router.post(
  "/",
  requireAuth,
  requireRole("admin", "trainer"),
  validate(progressSchema),
  createProgress
)

export default router
