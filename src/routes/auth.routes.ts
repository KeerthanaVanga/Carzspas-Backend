import { Router } from "express";
import {
  checkAdminLoggedIn,
  createAdmin,
  loginAdmin,
  refreshAdminToken,
  logoutUser,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", createAdmin);
router.post("/login", loginAdmin);
router.post("/refresh", refreshAdminToken);
router.get("/me", requireAuth, checkAdminLoggedIn);
router.post("/logout", requireAuth, logoutUser);
export default router;
