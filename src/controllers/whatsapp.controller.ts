import type { Request, Response } from "express";
import {
  getAllWhatsappUsers,
  getUserMessagesByPhone,
  getTodayUsersCount,
} from "../services/whatsapp.service.js";

export const fetchWhatsappUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await getAllWhatsappUsers();
    const todayUsers = await getTodayUsersCount();

    res.status(200).json({
      success: true,
      count: users.length,
      todayUsers: todayUsers,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching WhatsApp users:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch WhatsApp users",
    });
  }
};

export const fetchUserMessages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const phoneNumber = req.params.phoneNumber as string;

    if (!phoneNumber) {
      res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
      return;
    }

    const messages = await getUserMessagesByPhone(phoneNumber);

    if (!messages.length) {
      res.status(404).json({
        success: false,
        message: "No messages found for this phone number",
      });
      return;
    }

    res.status(200).json({
      success: true,
      phoneNumber,

      totalMessages: messages.length,
      data: messages.map((msg) => ({
        id: msg.id.toString(), // BigInt safe conversion
        message: msg.message,
        senderType: msg.sender_type,
        messageType: msg.message_type,
        createdAt: msg.created_at,
        status: msg.status,
        whatsappMessageId: msg.whatsapp_message_id,
      })),
    });
  } catch (error) {
    console.error("Error fetching user messages:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user messages",
    });
  }
};
