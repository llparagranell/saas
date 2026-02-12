import { Router } from "express"
import { z } from "zod"
import { createDiet, deleteDiet, listDiets, updateDiet } from "../controllers/diet.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const dietBodySchema = z.object({
  member: z.string().min(1),
  trainer: z.string().optional(),
  title: z.string().min(2),
  notes: z.string().optional(),
  meals: z
    .array(
      z.object({
        name: z.string(),
        time: z.string().optional(),
        items: z.array(z.string()).optional()
      })
    )
    .optional()
})

const dietCreateSchema = z.object({
  body: dietBodySchema
})

const dietUpdateSchema = z.object({
  body: dietBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update"
  })
})

router.get("/", requireAuth, listDiets)
router.post("/", requireAuth, requireRole("admin", "trainer"), validate(dietCreateSchema), createDiet)
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin", "trainer"),
  validate(dietUpdateSchema),
  updateDiet
)
router.delete("/:id", requireAuth, requireRole("admin", "trainer"), deleteDiet)

export default router
