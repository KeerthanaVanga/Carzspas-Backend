import { Router } from "express";
import {
  getCampaignLeads,
  getCampaignNames,
  updateLeadStatus,
} from "../controllers/campaignLead.controller";
import { requireAuth } from "../middlewares/auth.middleware.js";

const campaignLeadRouter = Router();

campaignLeadRouter.use(requireAuth);
campaignLeadRouter.get("/", getCampaignLeads);
campaignLeadRouter.patch("/:id/status", updateLeadStatus);
campaignLeadRouter.get("/campaigns", getCampaignNames);

export default campaignLeadRouter;
