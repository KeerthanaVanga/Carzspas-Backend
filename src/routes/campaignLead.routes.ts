import { Router } from "express";
import { getCampaignLeads } from "../controllers/campaignLead.controller";
import { requireAuth } from "../middlewares/auth.middleware.js";

const campaignLeadRouter = Router();

campaignLeadRouter.use(requireAuth);
campaignLeadRouter.get("/", getCampaignLeads);

export default campaignLeadRouter;
