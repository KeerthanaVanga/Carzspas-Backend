import { prisma } from "../database/prisma.js";

export const getAllServicesService = async () => {
  const services = await prisma.services.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      images: true,
      description: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return services;
};
