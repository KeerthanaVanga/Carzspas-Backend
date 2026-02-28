import { prisma } from "../database/prisma.js";

interface GetBookingsParams {
  page: number;
  limit: number;
}

export const getAllBookingsService = async ({
  page,
  limit,
}: GetBookingsParams) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    prisma.bookings.findMany({
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
    prisma.bookings.count(),
  ]);

  return {
    bookings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
