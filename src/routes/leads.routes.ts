import { Router } from "express";
import { fetchLatestHotLeads } from "../controllers/leads.controller.js";

const router = Router();

router.get("/hot", fetchLatestHotLeads);

export default router;
