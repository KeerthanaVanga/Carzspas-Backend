import type { Request, Response, NextFunction } from "express";
import { getAllBookingsService } from "../services/booking.service";

export const getAllBookings = async (
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

    const result = await getAllBookingsService({ page, limit });

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result.bookings,
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
