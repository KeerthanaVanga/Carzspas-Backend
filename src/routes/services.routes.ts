import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
} from "../controllers/services.controller.js";

const router = Router();

router.get("/", getAllServices);
router.post("/", createService);
router.put("/:id", updateService);
router.get("/:id", getServiceById);

export default router;
