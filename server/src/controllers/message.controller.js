import { sendMessageSchema } from "#app/schemas/message.schema";
import messageService from "#app/service/message.service";

const sendMessage = asyncHandler(async (req, res) => {
  const { body, params } = await zParse(sendMessageSchema, req);

  const { message } = body;
  const { id: receiverId } = params;
  const senderId = req.user.userId;

  const conversation = await MessageService.findOrCreateConversation(senderId, receiverId);

  const newMessage = await MessageService.createMessage({
    senderId,
    receiverId,
    message,
  });

  const savedMessage = await MessageService.saveMessageAndConversation(conversation, newMessage);
  const messageResponse = MessageService.formatMessageResponse(savedMessage);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Message sent successfully",
    data: messageResponse,
  });
});

export const MessageController = { sendMessage };
