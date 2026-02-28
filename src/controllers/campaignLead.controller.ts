import type { Request, Response, NextFunction } from "express";
import { getCampaignLeadsService } from "../services/campaignLeads.service.js";

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
