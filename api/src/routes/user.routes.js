import { Router } from "express"
import { z } from "zod"
import {
  assignTrainer,
  createUser,
  deleteUser,
  getMyMemberProfile,
  listMyMembers,
  listMembersWithProfile,
  listTrainersWithProfile,
  listUsers,
  updateUser
} from "../controllers/user.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const createSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    role: z.enum(["trainer", "member"]),
    profile: z.record(z.any()).optional()
  })
})

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional()
  })
})

const assignSchema = z.object({
  body: z.object({
    trainerId: z.string().min(1)
  })
})

// Member endpoint: get own profile (trainer + membership)
router.get("/me/profile", requireAuth, getMyMemberProfile)
// Trainer endpoint: list assigned members
router.get("/trainer/members", requireAuth, requireRole("trainer"), listMyMembers)

// Admin endpoints
router.use(requireAuth, requireRole("admin"))
router.get("/", listUsers)
router.get("/members", listMembersWithProfile)
router.get("/trainers", listTrainersWithProfile)
router.post("/", validate(createSchema), createUser)
router.patch("/:id", validate(updateSchema), updateUser)
router.delete("/:id", deleteUser)
router.patch("/members/:memberId/assign-trainer", validate(assignSchema), assignTrainer)

export default router
