import type { Request, Response, NextFunction } from "express";
import { getAllServicesService } from "../services/services.service.js";

export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const services = await getAllServicesService();

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};
