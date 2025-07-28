import { asyncHandler } from "#app/middlewares/async-handler.middleware";
import { sendMessageSchema } from "#app/schemas/message.schema";
import MessageService from "#app/service/message.service";
import { getReceiverSocketId, getIO } from "#app/socket/socket";

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

  const io = getIO();
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", savedMessage);
  }

  const messageResponse = MessageService.formatMessageResponse(savedMessage);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Message sent successfully",
    data: messageResponse,
  });
});

const getMessages = asyncHandler(async (req, res) => {
  const { params } = await zParse(getMessagesSchema, req);
  const { id: userToChatId } = params;
  const senderId = req.user.userId;

  const messages = await MessageService.getConversationMessages(senderId, userToChatId);

  const formattedMessages = messages.map((message) =>
    MessageService.formatMessageResponse(message)
  );

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: "Messages retrieved successfully",
    data: formattedMessages,
  });
});

export const MessageController = { sendMessage, getMessages };
