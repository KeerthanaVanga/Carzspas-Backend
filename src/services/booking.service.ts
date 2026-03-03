import { prisma } from "../database/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

interface GetBookingsParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const getAllBookingsService = async ({
  page,
  limit,
  status,
  search,
  startDate,
  endDate,
}: GetBookingsParams) => {
  const skip = (page - 1) * limit;

  const where: Prisma.bookingsWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (search) {
    where.OR = [
      {
        users: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        users: {
          phone: {
            // ✅ FIXED HERE
            contains: search,
          },
        },
      },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.bookings.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        users: true,
        services: true,
        branches: true,
      },
    }),
    prisma.bookings.count({ where }),
  ]);

  return {
    bookings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateBookingStatusService = async (
  bookingId: number,
  status: string,
) => {
  const booking = await prisma.bookings.update({
    where: {
      booking_id: bookingId,
    },
    data: {
      status,
      updated_at: new Date(),
    },
  });

  return booking;
};
