import { Router } from "express";
import { getAllBookings } from "../controllers/booking.controller";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth); // Protect all booking routes
router.get("/", getAllBookings);

export default router;
