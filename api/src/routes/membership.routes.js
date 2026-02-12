import { Router } from "express"
import { z } from "zod"
import {
  createPlan,
  deletePlan,
  listPlans,
  updatePlan
} from "../controllers/membership.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const planSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    durationMonths: z.number().min(1),
    price: z.number().min(0),
    isActive: z.boolean().optional(),
    description: z.string().optional()
  })
})

router.get("/", requireAuth, listPlans)
router.post("/", requireAuth, requireRole("admin"), validate(planSchema), createPlan)
router.patch("/:id", requireAuth, requireRole("admin"), validate(planSchema), updatePlan)
router.delete("/:id", requireAuth, requireRole("admin"), deletePlan)

export default router
