import { prisma } from "../database/prisma.js";

export interface WhatsAppUserDTO {
  name: string | null;
  phoneNumber: string;
  lastMessage: string;
  lastMessageTime: Date | null;
}

export const getAllWhatsappUsers = async (): Promise<WhatsAppUserDTO[]> => {
  const users = await prisma.$queryRaw<WhatsAppUserDTO[]>`
    SELECT DISTINCT ON (whatsappnumber)
      name,
      whatsappnumber AS "phoneNumber",
      message AS "lastMessage",
      created_at AS "lastMessageTime"
    FROM whatsapp_messages
    ORDER BY whatsappnumber, created_at DESC
  `;

  return users;
};

export const getTodayUsersCount = async (): Promise<number> => {
  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) 
    FROM (
      SELECT whatsappnumber, MIN(created_at) AS first_message
      FROM whatsapp_messages
      GROUP BY whatsappnumber
    ) t
    WHERE DATE(first_message) = CURRENT_DATE
  `;

  return Number(result[0]?.count ?? 0);
};

export interface UserMessageDTO {
  id: bigint;
  message: string;
  senderType: string;
  messageType: string | null;
  createdAt: Date | null;
}

export const getUserMessagesByPhone = async (phoneNumber: string) => {
  const messages = await prisma.whatsapp_messages.findMany({
    where: {
      whatsappnumber: phoneNumber,
    },
    orderBy: {
      created_at: "asc",
    },
    select: {
      id: true,
      message: true,
      sender_type: true,
      message_type: true,
      created_at: true,
      name: true,
      whatsappnumber: true,
      status: true,
      whatsapp_message_id: true,
    },
  });

  return messages;
};
