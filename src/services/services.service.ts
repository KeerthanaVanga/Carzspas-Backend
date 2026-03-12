import { prisma } from "../database/prisma.js";

export const getAllServicesService = async () => {
  return prisma.services.findMany({
    select: {
      id: true,
      service_name: true,
      url: true,
      images: true,
      description: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const createServiceService = async (data: {
  service_name: string;
  url?: string;
  images: string[];
  description?: string;
}) => {
  return prisma.services.create({
    data,
  });
};

export const updateServiceService = async (
  id: number,
  data: {
    service_name?: string;
    url?: string;
    images?: string[];
    description?: string;
  },
) => {
  return prisma.services.update({
    where: { id },
    data,
  });
};

export const getServiceByIdService = async (id: number) => {
  return prisma.services.findUnique({
    where: { id },
    select: {
      id: true,
      service_name: true,
      url: true,
      images: true,
      description: true,
      created_at: true,
      updated_at: true,
    },
  });
};
