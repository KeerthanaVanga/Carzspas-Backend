import { prisma } from "../database/prisma.js";

export const getDashboardStats = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalLeads,
    todayLeads,
    totalBookings,
    todayBookings,
    leadStatusRaw,
    campaignsRaw,
  ] = await Promise.all([
    prisma.campaign_leads.count(),

    prisma.campaign_leads.count({
      where: {
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.bookings.count(),

    prisma.bookings.count({
      where: {
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.campaign_leads.groupBy({
      by: ["lead_status"],
      _count: {
        id: true,
      },
    }),

    prisma.campaign_leads.groupBy({
      by: ["campaign_name"],
      _count: {
        id: true,
      },
    }),
  ]);

  const leadStatus = leadStatusRaw.map((item) => ({
    name: item.lead_status ?? "Unknown",
    value: item._count.id,
  }));

  const campaigns = campaignsRaw.map((item) => ({
    campaigns_name: item.campaign_name ?? "Unknown",
    value: item._count.id,
  }));

  return {
    totalLeads,
    todayLeads,
    totalBookings,
    todayBookings,
    leadStatus,
    campaigns,
  };
};
