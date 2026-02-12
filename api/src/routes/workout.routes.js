import { Router } from "express"
import { z } from "zod"
import {
  createWorkout,
  deleteWorkout,
  listWorkouts,
  updateWorkout
} from "../controllers/workout.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const workoutBodySchema = z.object({
  member: z.string().min(1),
  trainer: z.string().optional(),
  title: z.string().min(2),
  notes: z.string().optional(),
  schedule: z
    .array(
      z.object({
        day: z.string(),
        focus: z.string(),
        exercises: z
          .array(
            z.object({
              name: z.string(),
              sets: z.number().optional(),
              reps: z.number().optional()
            })
          )
          .optional()
      })
    )
    .optional()
})

const workoutCreateSchema = z.object({
  body: workoutBodySchema
})

const workoutUpdateSchema = z.object({
  body: workoutBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update"
  })
})

router.get("/", requireAuth, listWorkouts)
router.post(
  "/",
  requireAuth,
  requireRole("admin", "trainer"),
  validate(workoutCreateSchema),
  createWorkout
)
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin", "trainer"),
  validate(workoutUpdateSchema),
  updateWorkout
)
router.delete("/:id", requireAuth, requireRole("admin", "trainer"), deleteWorkout)

export default router
