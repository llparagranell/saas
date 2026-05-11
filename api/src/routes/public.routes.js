import { Router } from "express"
import { getHome } from "../controllers/public.controller.js"

const router = Router()

router.get("/home", getHome)

export default router

