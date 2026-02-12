import { Router } from "express"
import { z } from "zod"
import {
  createPayment,
  listPayments,
  razorpayPlaceholder
} from "../controllers/payment.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const paymentSchema = z.object({
  body: z.object({
    member: z.string().min(1),
    amount: z.number().min(0),
    method: z.enum(["cash", "card", "upi", "online", "razorpay"]).optional(),
    status: z.enum(["paid", "pending"]).optional(),
    reference: z.string().optional()
  })
})

router.get("/", requireAuth, listPayments)
router.post("/", requireAuth, requireRole("admin"), validate(paymentSchema), createPayment)
router.get("/razorpay", requireAuth, requireRole("admin"), razorpayPlaceholder)

export default router
