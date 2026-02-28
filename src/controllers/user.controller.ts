import type { Request, Response, NextFunction } from "express";
import { getUsersService } from "../services/user.service.js";

export const getUsers = async (
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

    const result = await getUsersService({
      page,
      limit,
      search: req.query.search as string,
      fromDate: req.query.fromDate as string,
      toDate: req.query.toDate as string,
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.users,
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
