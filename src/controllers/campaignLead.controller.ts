import type { Request, Response, NextFunction } from "express";
import {
  getCampaignLeadsService,
  updateLeadStatusService,
} from "../services/campaignLeads.service.js";
import { prisma } from "../database/prisma.js";

export const getCampaignLeads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers",
      });
    }

    const result = await getCampaignLeadsService({
      page,
      limit,
      search: req.query.search as string,
      lead_status: req.query.lead_status as string,
      campaign_name: req.query.campaign_name as string,
      fromDate: req.query.fromDate as string,
      toDate: req.query.toDate as string,
    });

    res.status(200).json({
      success: true,
      message: "Campaign leads fetched successfully",
      data: result.leads,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const { lead_status } = req.body;

    if (!id || !lead_status) {
      return res.status(400).json({
        success: false,
        message: "Lead ID and status are required",
      });
    }

    const updatedLead = await updateLeadStatusService(id, lead_status);

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const getCampaignNames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const campaigns = await prisma.campaign_leads.findMany({
      select: { campaign_name: true },
      distinct: ["campaign_name"],
    });

    res.json({
      success: true,
      data: campaigns.map((c) => c.campaign_name),
    });
  } catch (error) {
    next(error);
  }
};
