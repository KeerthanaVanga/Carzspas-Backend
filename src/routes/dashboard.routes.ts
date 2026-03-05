import { Router } from "express";
import { fetchDashboardStats } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", fetchDashboardStats);

export default router;
