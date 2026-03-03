import { Router } from "express";
import { getAllServices } from "../controllers/services.controller.js";

const router = Router();

router.get("/", getAllServices);

export default router;
