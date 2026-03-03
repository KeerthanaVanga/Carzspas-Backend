import { Router } from "express";
import {
  getAllBookings,
  getBookingStatus,
  updateBookingStatus,
} from "../controllers/booking.controller";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth); // Protect all booking routes
router.get("/", getAllBookings);
router.get("/booking-statuses", getBookingStatus);
router.patch("/:id/status", updateBookingStatus);

export default router;
