import { prisma } from "../database/prisma.js";

interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export const getUsersService = async ({
  page,
  limit,
  search,
  fromDate,
  toDate,
}: GetUsersParams) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  // 🔎 Search by name, email, phone
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  // 📅 Date Range Filter
  if (fromDate || toDate) {
    where.created_at = {};

    if (fromDate) {
      where.created_at.gte = new Date(fromDate);
    }

    if (toDate) {
      where.created_at.lte = new Date(toDate);
    }
  }

  const [users, total] = await Promise.all([
    prisma.users.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    }),
    prisma.users.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
