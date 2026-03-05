import type { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service.js";

export const fetchDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await getDashboardStats();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
