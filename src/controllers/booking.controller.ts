import type { Request, Response, NextFunction } from "express";
import {
  getAllBookingsService,
  updateBookingStatusService,
} from "../services/booking.service";
import { prisma } from "../database/prisma";

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers",
      });
    }

    const params = {
      page,
      limit,
      ...(status && { status }),
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    };

    const result = await getAllBookingsService(params);

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

export const getBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingStatus = await prisma.bookings.findMany({
      select: { status: true },
      distinct: ["status"],
    });

    res.json({
      success: true,
      data: bookingStatus.map((b) => b.status),
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = Number(req.params.id);
    const { status } = req.body as { status: string };

    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and status are required",
      });
    }

    const updated = await updateBookingStatusService(bookingId, status);

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
