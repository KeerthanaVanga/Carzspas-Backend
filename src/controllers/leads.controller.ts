import type { Request, Response } from "express";
import { getLatestHotLeads } from "../services/leads.service.js";

export const fetchLatestHotLeads = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const leads = await getLatestHotLeads();

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Hot Leads Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hot leads",
    });
  }
};
