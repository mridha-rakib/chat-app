import { sendMessageSchema } from "#app/schemas/message.schema";
import messageService from "#app/service/message.service";

const sendMessage = asyncHandler(async (req, res) => {
  const { body, params } = await zParse(sendMessageSchema, req);

  const { message } = body;
  const { id: receiverId } = params;
  const senderId = req.user.userId;

  const conversation = await MessageService.findOrCreateConversation(senderId, receiverId);
  
});

export const MessageController = { sendMessage };
