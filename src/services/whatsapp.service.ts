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
      created_at: "desc",
    },
    select: {
      id: true,
      message: true,
      sender_type: true,
      message_type: true,
      created_at: true,
      name: true,
      whatsappnumber: true,
    },
  });

  return messages;
};
