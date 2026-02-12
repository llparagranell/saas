import { Router } from "express"
import { adminSummary, revenueByMonth } from "../controllers/report.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { requireRole } from "../middleware/rbac.js"

const router = Router()

router.get("/summary", requireAuth, requireRole("admin"), adminSummary)
router.get("/revenue-monthly", requireAuth, requireRole("admin"), revenueByMonth)

export default router
