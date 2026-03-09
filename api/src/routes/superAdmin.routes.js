import { Router } from "express"
import { z } from "zod"
import { createGymWithAdmin, listGyms } from "../controllers/superAdmin.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const createGymSchema = z.object({
  body: z.object({
    gymName: z.string().min(2),
    gymCode: z.string().min(2).optional(),
    admin: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().optional()
    })
  })
})

router.use(requireAuth, requireRole("super_admin"))
router.get("/gyms", listGyms)
router.post("/gyms", validate(createGymSchema), createGymWithAdmin)

export default router
