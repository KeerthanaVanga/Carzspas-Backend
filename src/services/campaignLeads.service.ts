import { prisma } from "../database/prisma.js";

interface GetLeadsParams {
  page: number;
  limit: number;
  search?: string;
  lead_status?: string;
  campaign_name?: string;
  fromDate?: string;
  toDate?: string;
}

export const getCampaignLeadsService = async ({
  page,
  limit,
  search,
  lead_status,
  campaign_name,
  fromDate,
  toDate,
}: GetLeadsParams) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  // 🔎 Search by name or phone
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone_number: { contains: search } },
      { car_brand: { contains: search, mode: "insensitive" } },
      { car_model: { contains: search, mode: "insensitive" } },
    ];
  }

  // 🎯 Filter by status
  if (lead_status) {
    where.lead_status = lead_status;
  }

  // 📢 Filter by campaign name
  if (campaign_name) {
    where.campaign_name = {
      contains: campaign_name,
      mode: "insensitive",
    };
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

  const [leads, total] = await Promise.all([
    prisma.campaign_leads.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.campaign_leads.count({ where }),
  ]);

  return {
    leads,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const allowedStatuses = ["Cold", "Warm", "Hot", "Contacted", "Closed"];

export const updateLeadStatusService = async (
  id: number,
  lead_status: string,
) => {
  if (!allowedStatuses.includes(lead_status)) {
    throw new Error("Invalid lead status");
  }

  const lead = await prisma.campaign_leads.update({
    where: { id },
    data: {
      lead_status,
      updated_at: new Date(),
    },
  });

  return lead;
};
