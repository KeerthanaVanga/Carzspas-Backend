import { Router } from "express";
import {
  fetchUserMessages,
  fetchWhatsappUsers,
} from "../controllers/whatsapp.controller";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth); // Protect all WhatsApp routes with authentication
router.get("/users", fetchWhatsappUsers);
router.get("/users/:phoneNumber/messages", fetchUserMessages);

export default router;
