import { prisma } from "../database/prisma.js";

export const getLatestHotLeads = async () => {
  const leads = await prisma.campaign_leads.findMany({
    where: {
      lead_status: "Hot",
    },
    orderBy: {
      created_at: "desc",
    },
    take: 10, // latest 10 hot leads
    select: {
      id: true,
      name: true,
      phone_number: true,
      car_brand: true,
      car_model: true,
      campaign_name: true,
      lead_status: true,
    },
  });

  return leads;
};
