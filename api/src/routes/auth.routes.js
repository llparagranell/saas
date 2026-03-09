import { Router } from "express"
import { z } from "zod"
import { login, me, registerMember, registerSuperAdmin } from "../controllers/auth.controller.js"
import { validate } from "../middleware/validate.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    gymId: z.string().min(1)
  })
})

const superAdminRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    setupKey: z.string().optional()
  })
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
})

router.post("/register", validate(registerSchema), registerMember)
router.post("/register-super-admin", validate(superAdminRegisterSchema), registerSuperAdmin)
router.post("/login", validate(loginSchema), login)
router.get("/me", requireAuth, me)

export default router
